import { supabase, handleSupabaseError } from "@/lib/supabase"

// TODO(schema): Expected notifications table schema:
// id (uuid, pk), user_id (uuid, references auth.users), title (text),
// message (text), type (text: 'info' | 'ai' | 'milestone' | 'warning'),
// is_read (boolean), created_at (timestamptz)

export interface NotificationDto {
  id: string
  user_id: string
  title: string
  message: string
  type?: "info" | "ai" | "milestone" | "warning"
  is_read: boolean
  created_at: string
}

export async function getNotifications(userId?: string): Promise<NotificationDto[]> {
  try {
    const targetId = userId || (await supabase.auth.getUser()).data.user?.id
    if (!targetId) return []

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", targetId)
      .order("created_at", { ascending: false })

    if (error) {
      handleSupabaseError(error, "Could not fetch notifications.")
      return []
    }

    return (data as NotificationDto[]) || []
  } catch (err) {
    handleSupabaseError(err)
    return []
  }
}

export async function markNotificationAsRead(notificationId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId)

    if (error) {
      handleSupabaseError(error, "Failed to mark notification as read.")
      return false
    }

    return true
  } catch (err) {
    handleSupabaseError(err)
    return false
  }
}

/**
 * Real-time subscription for notifications.
 */
export function subscribeToNotifications(
  userId: string,
  onNotification: (notification: NotificationDto) => void,
) {
  const channel = supabase
    .channel(`public:notifications:user_id=eq.${userId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${userId}`,
      },
      (payload) => onNotification(payload.new as NotificationDto),
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}
