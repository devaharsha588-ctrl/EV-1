import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import { supabase } from "@/lib/supabase"
import { getAuthSession, mapSupabaseSession } from "@/services/auth.service"
import type { AuthSession } from "@/types/auth.types"

interface AuthContextValue {
  readonly authGuardEnabled: boolean
  readonly clearSession: () => void
  readonly isAuthenticated: boolean
  readonly isLoading: boolean
  readonly session: AuthSession | null
  readonly setSession: (session: AuthSession | null) => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { readonly children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  /* Fetch initial session & set up auth listener */
  useEffect(() => {
    let isMounted = true

    getAuthSession().then((initialSession) => {
      if (isMounted) {
        setSession(initialSession)
        setIsLoading(false)
      }
    })

    /* Listen for auto refresh, login, logout, and token updates */
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, rawSession) => {
      if (!isMounted) return

      if (rawSession) {
        setSession(mapSupabaseSession(rawSession))
        setIsLoading(false)
      } else if (event === "SIGNED_OUT") {
        setSession(null)
        setIsLoading(false)
      } else {
        getAuthSession().then((fallbackSession) => {
          if (isMounted) {
            setSession(fallbackSession)
            setIsLoading(false)
          }
        })
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const clearSession = useCallback(() => {
    setSession(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      authGuardEnabled: true,
      clearSession,
      isAuthenticated: Boolean(session && session.user),
      isLoading,
      session,
      setSession,
    }),
    [clearSession, isLoading, session],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider")
  }

  return context
}
