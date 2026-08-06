import { supabase, handleSupabaseError } from "@/lib/supabase"
import type { AnalyticsOverviewDto } from "@/types/domain.types"

// TODO(schema): Expected analytics table schema:
// id (uuid, pk), user_id (uuid, references auth.users), learning_hours (int),
// modules_completed (int), score_progression (jsonb), skill_growth (jsonb),
// updated_at (timestamptz)

export async function getAnalyticsOverview(userId?: string): Promise<AnalyticsOverviewDto | null> {
  try {
    const targetId = userId || (await supabase.auth.getUser()).data.user?.id
    if (!targetId) return null

    const { data, error } = await supabase
      .from("analytics")
      .select("*")
      .eq("user_id", targetId)
      .maybeSingle()

    if (error) {
      handleSupabaseError(error, "Could not fetch learning analytics.")
      return null
    }

    return (data as AnalyticsOverviewDto) || null
  } catch (err) {
    handleSupabaseError(err)
    return null
  }
}
