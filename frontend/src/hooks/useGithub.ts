import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { getGithubAnalysis, syncGithubAnalysis } from "@/services/github.service"
import type { DeferredQueryOptions } from "@/types/query.types"

import { queryKeys } from "./queryKeys"

export function useGithub(options: DeferredQueryOptions = {}) {
  return useQuery({
    enabled: options.enabled ?? false,
    queryFn: () => getGithubAnalysis(),
    queryKey: queryKeys.github.analysis(),
  })
}

export function useSyncGithubMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: Record<string, unknown>) => syncGithubAnalysis(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.github.analysis(), data)
      queryClient.invalidateQueries({ queryKey: queryKeys.github.analysis() })
    },
  })
}
