import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { getRoadmap, updateRoadmapProgress } from "@/services/roadmap.service"
import type { DeferredQueryOptions } from "@/types/query.types"

import { queryKeys } from "./queryKeys"

export function useRoadmap(options: DeferredQueryOptions = {}) {
  return useQuery({
    enabled: options.enabled ?? false,
    queryFn: () => getRoadmap(),
    queryKey: queryKeys.roadmap.current(),
  })
}

export function useUpdateRoadmapMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (updates: Record<string, unknown>) => updateRoadmapProgress(updates),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.roadmap.current(), data)
      queryClient.invalidateQueries({ queryKey: queryKeys.roadmap.current() })
    },
  })
}
