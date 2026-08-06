import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { getTasks, updateTaskStatus } from "@/services/tasks.service"
import type { DeferredQueryOptions } from "@/types/query.types"

import { queryKeys } from "./queryKeys"

export function useTasks(options: DeferredQueryOptions = {}) {
  return useQuery({
    enabled: options.enabled ?? false,
    queryFn: () => getTasks(),
    queryKey: queryKeys.tasks.all(),
  })
}

export function useUpdateTaskStatusMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: "pending" | "in_progress" | "completed" }) =>
      updateTaskStatus(taskId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all() })
    },
  })
}
