import { useQuery } from "@tanstack/react-query"

import { getAnalyticsOverview } from "@/services/analytics.service"
import type { DeferredQueryOptions } from "@/types/query.types"

import { queryKeys } from "./queryKeys"

export function useAnalytics(options: DeferredQueryOptions = {}) {
  return useQuery({
    enabled: options.enabled ?? false,
    queryFn: () => getAnalyticsOverview(),
    queryKey: queryKeys.analytics.overview(),
  })
}
