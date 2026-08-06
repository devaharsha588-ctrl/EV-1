import { supabase, handleSupabaseError } from "@/lib/supabase"
import type { ChatThreadListDto } from "@/types/domain.types"

// TODO(schema): Expected chat_threads and chat_messages tables schema:
// chat_threads: id (uuid, pk), user_id (uuid, references auth.users), title (text),
//               preview (text), updated_at (timestamptz)
// chat_messages: id (uuid, pk), thread_id (uuid, references chat_threads),
//                user_id (uuid, references auth.users), role (text: 'user' | 'ai'),
//                content (text), created_at (timestamptz)

export async function getChatThreads(userId?: string): Promise<ChatThreadListDto | null> {
  try {
    const targetId = userId || (await supabase.auth.getUser()).data.user?.id
    if (!targetId) return null

    const { data, error } = await supabase
      .from("chat_threads")
      .select("*")
      .eq("user_id", targetId)
      .order("updated_at", { ascending: false })

    if (error) {
      handleSupabaseError(error, "Could not fetch chat threads.")
      return null
    }

    return (data as unknown as ChatThreadListDto) || null
  } catch (err) {
    handleSupabaseError(err)
    return null
  }
}

export async function getChatMessages(threadId: string) {
  try {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("thread_id", threadId)
      .order("created_at", { ascending: true })

    if (error) {
      handleSupabaseError(error, "Could not fetch messages.")
      return []
    }

    return data || []
  } catch (err) {
    handleSupabaseError(err)
    return []
  }
}

export async function sendChatMessage(threadId: string, content: string, role: "user" | "ai" = "user") {
  try {
    const userId = (await supabase.auth.getUser()).data.user?.id
    if (!userId) return null

    const { data, error } = await supabase
      .from("chat_messages")
      .insert([{ thread_id: threadId, user_id: userId, role, content }])
      .select()
      .single()

    if (error) {
      handleSupabaseError(error, "Failed to send chat message.")
      return null
    }

    return data
  } catch (err) {
    handleSupabaseError(err)
    return null
  }
}

/**
 * Real-time subscription for chat messages in a thread.
 */
export function subscribeToChatMessages(
  threadId: string,
  onMessage: (message: Record<string, unknown>) => void,
) {
  const channel = supabase
    .channel(`public:chat_messages:thread_id=eq.${threadId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "chat_messages",
        filter: `thread_id=eq.${threadId}`,
      },
      (payload) => onMessage(payload.new),
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}
