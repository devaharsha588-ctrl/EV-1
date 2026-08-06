import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  getUserSettings,
  updateUserSettings,
  type UserSettingsDto,
} from "@/services/settings.service"
import type { DeferredQueryOptions } from "@/types/query.types"

import { queryKeys } from "./queryKeys"

export function useSettings(options: DeferredQueryOptions = {}) {
  return useQuery({
    enabled: options.enabled ?? false,
    queryFn: () => getUserSettings(),
    queryKey: queryKeys.settings.user(),
  })
}

export function useUpdateSettingsMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (settings: Partial<UserSettingsDto>) => updateUserSettings(settings),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.settings.user(), data)
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.user() })
    },
  })
}
