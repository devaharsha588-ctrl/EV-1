import { supabase, handleSupabaseError } from "@/lib/supabase"
import type { DashboardSummaryDto } from "@/types/domain.types"

// TODO(schema): Expected dashboard table schema:
// id (uuid, pk), user_id (uuid, references auth.users), career_score (int),
// streak_days (int), daily_summary (text), today_focus (text), skill_progression (jsonb),
// recent_activity (jsonb), updated_at (timestamptz)

export async function getDashboardSummary(userId?: string): Promise<DashboardSummaryDto | null> {
  try {
    const targetId = userId || (await supabase.auth.getUser()).data.user?.id
    if (!targetId) return null

    const { data, error } = await supabase
      .from("dashboard")
      .select("*")
      .eq("user_id", targetId)
      .maybeSingle()

    if (error) {
      handleSupabaseError(error, "Could not fetch dashboard data.")
      return null
    }

    return (data as DashboardSummaryDto) || null
  } catch (err) {
    handleSupabaseError(err)
    return null
  }
}

export async function updateDashboardSummary(
  updates: Record<string, unknown>,
  userId?: string,
): Promise<DashboardSummaryDto | null> {
  try {
    const targetId = userId || (await supabase.auth.getUser()).data.user?.id
    if (!targetId) return null

    const { data, error } = await supabase
      .from("dashboard")
      .upsert({ user_id: targetId, ...updates, updated_at: new Date().toISOString() })
      .select()
      .single()

    if (error) {
      handleSupabaseError(error, "Failed to update dashboard data.")
      return null
    }

    return (data as DashboardSummaryDto) || null
  } catch (err) {
    handleSupabaseError(err)
    return null
  }
}

/**
 * Real-time subscription for dashboard updates.
 */
export function subscribeToDashboardUpdates(
  userId: string,
  onUpdate: (payload: Record<string, unknown>) => void,
) {
  const channel = supabase
    .channel(`public:dashboard:user_id=eq.${userId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "dashboard",
        filter: `user_id=eq.${userId}`,
      },
      (payload) => onUpdate(payload.new),
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}
