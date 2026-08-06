import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { getResumeWorkspace, saveResumeAnalysis } from "@/services/resume.service"
import type { DeferredQueryOptions } from "@/types/query.types"

import { queryKeys } from "./queryKeys"

export function useResume(options: DeferredQueryOptions = {}) {
  return useQuery({
    enabled: options.enabled ?? false,
    queryFn: () => getResumeWorkspace(),
    queryKey: queryKeys.resume.workspace(),
  })
}

export function useSaveResumeMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: Record<string, unknown>) => saveResumeAnalysis(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.resume.workspace(), data)
      queryClient.invalidateQueries({ queryKey: queryKeys.resume.workspace() })
    },
  })
}
