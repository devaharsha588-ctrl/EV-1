import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  getChatMessages,
  getChatThreads,
  sendChatMessage,
} from "@/services/chat.service"
import type { DeferredQueryOptions } from "@/types/query.types"

import { queryKeys } from "./queryKeys"

export function useChat(options: DeferredQueryOptions = {}) {
  return useQuery({
    enabled: options.enabled ?? false,
    queryFn: () => getChatThreads(),
    queryKey: queryKeys.chat.threads(),
  })
}

export function useChatMessagesQuery(threadId: string, options: DeferredQueryOptions = {}) {
  return useQuery({
    enabled: (options.enabled ?? true) && Boolean(threadId),
    queryFn: () => getChatMessages(threadId),
    queryKey: queryKeys.chat.messages(threadId),
  })
}

export function useSendChatMessageMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ threadId, content, role }: { threadId: string; content: string; role?: "user" | "ai" }) =>
      sendChatMessage(threadId, content, role),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.messages(variables.threadId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.threads() })
    },
  })
}
