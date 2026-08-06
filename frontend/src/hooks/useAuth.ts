import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { useAuthContext } from "@/context/AuthContext"
import {
  getAuthSession,
  login,
  loginWithGithub,
  loginWithGoogle,
  logout,
  register,
} from "@/services/auth.service"
import type { AuthSession, LoginCredentials, RegisterCredentials } from "@/types/auth.types"
import type { DeferredQueryOptions } from "@/types/query.types"

import { queryKeys } from "./queryKeys"

export function useAuth() {
  return useAuthContext()
}

export function useAuthSessionQuery(options: DeferredQueryOptions = {}) {
  return useQuery({
    enabled: options.enabled ?? false,
    queryFn: () => getAuthSession(),
    queryKey: queryKeys.auth.session(),
  })
}

export function useLoginMutation() {
  const { setSession } = useAuthContext()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => login(credentials),
    onSuccess: (session: AuthSession | null) => {
      if (session) {
        setSession(session)
        queryClient.setQueryData(queryKeys.auth.session(), session)
      }
    },
  })
}

export function useGoogleLoginMutation() {
  return useMutation({
    mutationFn: loginWithGoogle,
  })
}

export function useGithubLoginMutation() {
  return useMutation({
    mutationFn: loginWithGithub,
  })
}

export function useLogoutMutation() {
  const { clearSession } = useAuthContext()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearSession()
      queryClient.removeQueries({ queryKey: queryKeys.auth.session() })
    },
  })
}

export function useRegisterMutation() {
  const { setSession } = useAuthContext()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials: RegisterCredentials) => register(credentials),
    onSuccess: (session: AuthSession | null) => {
      if (session) {
        setSession(session)
        queryClient.setQueryData(queryKeys.auth.session(), session)
      }
    },
  })
}
