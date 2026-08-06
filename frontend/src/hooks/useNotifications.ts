import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  getNotifications,
  markNotificationAsRead,
} from "@/services/notifications.service"
import type { DeferredQueryOptions } from "@/types/query.types"

import { queryKeys } from "./queryKeys"

export function useNotifications(options: DeferredQueryOptions = {}) {
  return useQuery({
    enabled: options.enabled ?? false,
    queryFn: () => getNotifications(),
    queryKey: queryKeys.notifications.all(),
  })
}

export function useMarkNotificationReadMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all() })
    },
  })
}
