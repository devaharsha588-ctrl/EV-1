import { apiClient } from "@/api/client"
import { supabase } from "@/lib/supabase"
import type { ChatThreadListDto } from "@/types/domain.types"

export interface ChatMessageItem {
  id: string
  role: "user" | "ai"
  content: string
  timestamp: string
  provider?: string
}

export async function getChatThreads(userId?: string): Promise<ChatThreadListDto | null> {
  try {
    const res = await apiClient.get("/chat/history")
    if (res.data?.data?.chats) {
      return res.data.data.chats
    }
  } catch (err) {
    console.warn("[Backend API] Chat history fallback to local/supabase:", err)
  }

  // Fallback to Supabase if available
  try {
    const targetId = userId || (await supabase.auth.getUser()).data.user?.id
    if (!targetId) return null

    const { data } = await supabase
      .from("chat_threads")
      .select("*")
      .eq("user_id", targetId)
      .order("updated_at", { ascending: false })

    return (data as unknown as ChatThreadListDto) || null
  } catch {
    return null
  }
}

export async function getChatMessages(threadId: string): Promise<ChatMessageItem[]> {
  try {
    const res = await apiClient.get("/chat/history", { params: { conversationId: threadId } })
    if (res.data?.data?.chats && Array.isArray(res.data.data.chats)) {
      return res.data.data.chats.map((item: any) => ({
        id: item.id?.toString() || Date.now().toString(),
        role: item.role || "ai",
        content: item.message || item.content || item.response || "",
        timestamp: item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        provider: item.provider
      }))
    }
  } catch (err) {
    console.warn("[Backend API] Fetch messages fallback:", err)
  }

  return []
}

export async function sendChatMessage(content: string, conversationId?: string, provider?: string) {
  try {
    const res = await apiClient.post("/chat", {
      message: content,
      provider: provider || undefined,
      conversationId: conversationId || null
    })

    if (res.data?.data?.chat) {
      const chat = res.data.data.chat
      return {
        userMessage: {
          id: Date.now().toString(),
          role: "user" as const,
          content,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        },
        aiMessage: {
          id: (Date.now() + 1).toString(),
          role: "ai" as const,
          content: chat.response || chat.message || "I'm EV AI, here to help you Evolve & Empower your learning journey!",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          provider: chat.provider || provider
        }
      }
    }
  } catch (err: any) {
    console.error("[Backend API Error]:", err?.response?.data || err.message)
    const errorMsg =
      err?.response?.data?.message ||
      "EV AI backend is starting up or temporarily unreachable. Please ensure VITE_API_BASE_URL points to your live Render backend."

    return {
      userMessage: {
        id: Date.now().toString(),
        role: "user" as const,
        content,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
      aiMessage: {
        id: (Date.now() + 1).toString(),
        role: "ai" as const,
        content: `⚠️ ${errorMsg}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    }
  }

  return null
}

export function subscribeToChatMessages(
  _threadId: string,
  _onMessage: (message: Record<string, unknown>) => void,
) {
  return () => {}
}
