import { supabase, handleSupabaseError } from "@/lib/supabase"
import type { GithubAnalysisDto } from "@/types/domain.types"

// TODO(schema): Expected github_analysis table schema:
// id (uuid, pk), user_id (uuid, references auth.users), github_username (text),
// repositories_count (int), total_stars (int), contributions_count (int), streak_days (int),
// language_breakdown (jsonb), insights (jsonb), updated_at (timestamptz)

export async function getGithubAnalysis(userId?: string): Promise<GithubAnalysisDto | null> {
  try {
    const targetId = userId || (await supabase.auth.getUser()).data.user?.id
    if (!targetId) return null

    const { data, error } = await supabase
      .from("github_analysis")
      .select("*")
      .eq("user_id", targetId)
      .maybeSingle()

    if (error) {
      handleSupabaseError(error, "Could not fetch GitHub intelligence analysis.")
      return null
    }

    return (data as GithubAnalysisDto) || null
  } catch (err) {
    handleSupabaseError(err)
    return null
  }
}

export async function syncGithubAnalysis(
  payload: Record<string, unknown>,
  userId?: string,
): Promise<GithubAnalysisDto | null> {
  try {
    const targetId = userId || (await supabase.auth.getUser()).data.user?.id
    if (!targetId) return null

    const { data, error } = await supabase
      .from("github_analysis")
      .upsert({ user_id: targetId, ...payload, updated_at: new Date().toISOString() })
      .select()
      .single()

    if (error) {
      handleSupabaseError(error, "Failed to sync GitHub analysis.")
      return null
    }

    return (data as GithubAnalysisDto) || null
  } catch (err) {
    handleSupabaseError(err)
    return null
  }
}
