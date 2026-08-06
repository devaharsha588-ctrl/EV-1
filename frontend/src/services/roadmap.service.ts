import { supabase, handleSupabaseError } from "@/lib/supabase"
import type { RoadmapDto } from "@/types/domain.types"

// TODO(schema): Expected roadmaps table schema:
// id (uuid, pk), user_id (uuid, references auth.users), title (text),
// overall_progress (int), current_phase (text), phases (jsonb), recommendations (jsonb),
// updated_at (timestamptz)

export async function getRoadmap(userId?: string): Promise<RoadmapDto | null> {
  try {
    const targetId = userId || (await supabase.auth.getUser()).data.user?.id
    if (!targetId) return null

    const { data, error } = await supabase
      .from("roadmaps")
      .select("*")
      .eq("user_id", targetId)
      .maybeSingle()

    if (error) {
      handleSupabaseError(error, "Could not fetch career roadmap.")
      return null
    }

    return (data as RoadmapDto) || null
  } catch (err) {
    handleSupabaseError(err)
    return null
  }
}

export async function updateRoadmapProgress(
  updates: Record<string, unknown>,
  userId?: string,
): Promise<RoadmapDto | null> {
  try {
    const targetId = userId || (await supabase.auth.getUser()).data.user?.id
    if (!targetId) return null

    const { data, error } = await supabase
      .from("roadmaps")
      .upsert({ user_id: targetId, ...updates, updated_at: new Date().toISOString() })
      .select()
      .single()

    if (error) {
      handleSupabaseError(error, "Failed to update roadmap progress.")
      return null
    }

    return (data as RoadmapDto) || null
  } catch (err) {
    handleSupabaseError(err)
    return null
  }
}

/**
 * Real-time subscription for roadmap changes.
 */
export function subscribeToRoadmapProgress(
  userId: string,
  onUpdate: (payload: Record<string, unknown>) => void,
) {
  const channel = supabase
    .channel(`public:roadmaps:user_id=eq.${userId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "roadmaps",
        filter: `user_id=eq.${userId}`,
      },
      (payload) => onUpdate(payload.new),
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}
