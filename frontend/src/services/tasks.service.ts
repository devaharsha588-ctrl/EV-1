import { supabase, handleSupabaseError } from "@/lib/supabase"

// TODO(schema): Expected tasks table schema:
// id (uuid, pk), user_id (uuid, references auth.users), title (text),
// status (text: 'pending' | 'in_progress' | 'completed'), priority (text),
// due_date (timestamptz), updated_at (timestamptz)

export interface TaskDto {
  id: string
  user_id: string
  title: string
  status: "pending" | "in_progress" | "completed"
  priority?: "low" | "medium" | "high"
  due_date?: string
}

export async function getTasks(userId?: string): Promise<TaskDto[]> {
  try {
    const targetId = userId || (await supabase.auth.getUser()).data.user?.id
    if (!targetId) return []

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", targetId)
      .order("due_date", { ascending: true })

    if (error) {
      handleSupabaseError(error, "Could not fetch tasks.")
      return []
    }

    return (data as TaskDto[]) || []
  } catch (err) {
    handleSupabaseError(err)
    return []
  }
}

export async function updateTaskStatus(
  taskId: string,
  status: TaskDto["status"],
): Promise<TaskDto | null> {
  try {
    const { data, error } = await supabase
      .from("tasks")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", taskId)
      .select()
      .single()

    if (error) {
      handleSupabaseError(error, "Failed to update task status.")
      return null
    }

    return (data as TaskDto) || null
  } catch (err) {
    handleSupabaseError(err)
    return null
  }
}
