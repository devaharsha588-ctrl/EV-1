import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { getDashboardSummary, updateDashboardSummary } from "@/services/dashboard.service"
import type { DeferredQueryOptions } from "@/types/query.types"

import { queryKeys } from "./queryKeys"

export function useDashboard(options: DeferredQueryOptions = {}) {
  return useQuery({
    enabled: options.enabled ?? false,
    queryFn: () => getDashboardSummary(),
    queryKey: queryKeys.dashboard.summary(),
  })
}

export function useUpdateDashboardMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (updates: Record<string, unknown>) => updateDashboardSummary(updates),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.dashboard.summary(), data)
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.summary() })
    },
  })
}
