import { supabase, handleSupabaseError } from "@/lib/supabase"

// TODO(schema): Expected settings table schema:
// id (uuid, pk), user_id (uuid, references auth.users), theme (text: 'light' | 'dark' | 'system'),
// email_notifications (boolean), ai_alerts (boolean), sidebar_collapsed (boolean),
// updated_at (timestamptz)

export interface UserSettingsDto {
  id?: string
  user_id?: string
  theme?: "light" | "dark" | "system"
  email_notifications?: boolean
  ai_alerts?: boolean
  sidebar_collapsed?: boolean
}

export async function getUserSettings(userId?: string): Promise<UserSettingsDto | null> {
  try {
    const targetId = userId || (await supabase.auth.getUser()).data.user?.id
    if (!targetId) return null

    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .eq("user_id", targetId)
      .maybeSingle()

    if (error) {
      handleSupabaseError(error, "Could not fetch user settings.")
      return null
    }

    return (data as UserSettingsDto) || null
  } catch (err) {
    handleSupabaseError(err)
    return null
  }
}

export async function updateUserSettings(
  settings: Partial<UserSettingsDto>,
  userId?: string,
): Promise<UserSettingsDto | null> {
  try {
    const targetId = userId || (await supabase.auth.getUser()).data.user?.id
    if (!targetId) return null

    const { data, error } = await supabase
      .from("settings")
      .upsert({ user_id: targetId, ...settings, updated_at: new Date().toISOString() })
      .select()
      .single()

    if (error) {
      handleSupabaseError(error, "Failed to update user settings.")
      return null
    }

    return (data as UserSettingsDto) || null
  } catch (err) {
    handleSupabaseError(err)
    return null
  }
}
