import { supabase, handleSupabaseError } from "@/lib/supabase"
import type { ResumeWorkspaceDto } from "@/types/domain.types"

// TODO(schema): Expected resume_analysis table schema:
// id (uuid, pk), user_id (uuid, references auth.users), ats_score (int),
// summary (text), experience (jsonb), education (jsonb), skills (jsonb),
// suggestions (jsonb), updated_at (timestamptz)

export async function getResumeWorkspace(userId?: string): Promise<ResumeWorkspaceDto | null> {
  try {
    const targetId = userId || (await supabase.auth.getUser()).data.user?.id
    if (!targetId) return null

    const { data, error } = await supabase
      .from("resume_analysis")
      .select("*")
      .eq("user_id", targetId)
      .maybeSingle()

    if (error) {
      handleSupabaseError(error, "Could not fetch resume analysis.")
      return null
    }

    return (data as ResumeWorkspaceDto) || null
  } catch (err) {
    handleSupabaseError(err)
    return null
  }
}

export async function saveResumeAnalysis(
  payload: Record<string, unknown>,
  userId?: string,
): Promise<ResumeWorkspaceDto | null> {
  try {
    const targetId = userId || (await supabase.auth.getUser()).data.user?.id
    if (!targetId) return null

    const { data, error } = await supabase
      .from("resume_analysis")
      .upsert({ user_id: targetId, ...payload, updated_at: new Date().toISOString() })
      .select()
      .single()

    if (error) {
      handleSupabaseError(error, "Failed to save resume analysis.")
      return null
    }

    return (data as ResumeWorkspaceDto) || null
  } catch (err) {
    handleSupabaseError(err)
    return null
  }
}
