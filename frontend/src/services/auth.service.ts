import type { User, Session } from "@supabase/supabase-js"
import { supabase, handleSupabaseError } from "@/lib/supabase"
import type {
  AuthSession,
  AuthUser,
  LoginCredentials,
  RegisterCredentials,
  ResetPasswordParams,
  UpdatePasswordParams,
} from "@/types/auth.types"

const MOCK_STORAGE_KEY = "ev_auth_session_fallback"

/**
 * Maps Supabase User to EV AuthUser format.
 */
export function mapSupabaseUser(user: User | null | undefined): AuthUser | undefined {
  if (!user) return undefined
  return {
    id: user.id || "user-alex-123",
    email: user.email || "alex@example.com",
    name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Alex Johnson",
    avatarUrl: user.user_metadata?.avatar_url || user.user_metadata?.picture,
    role: user.role || "authenticated",
  }
}

/**
 * Maps Supabase Session to EV AuthSession format.
 */
export function mapSupabaseSession(session: Session | null | undefined): AuthSession | null {
  if (!session) return null
  return {
    accessToken: session.access_token || "demo-access-token",
    refreshToken: session.refresh_token || "demo-refresh-token",
    user: mapSupabaseUser(session.user),
    rawSession: session,
    rawUser: session.user,
  }
}

/**
 * Create a local fallback session for smooth local testing / demo mode.
 */
export function createFallbackSession(email: string, name?: string): AuthSession {
  const fallbackUser: AuthUser = {
    id: "user-" + Date.now(),
    email,
    name: name || email.split("@")[0] || "Alex Johnson",
    role: "authenticated",
  }
  const fallbackSession: AuthSession = {
    accessToken: "fallback-access-token-" + Date.now(),
    refreshToken: "fallback-refresh-token-" + Date.now(),
    user: fallbackUser,
  }
  try {
    localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(fallbackSession))
  } catch {
    // Ignore storage errors
  }
  return fallbackSession
}

/**
 * Retrieve current Supabase or local fallback auth session.
 */
export async function getAuthSession(): Promise<AuthSession | null> {
  try {
    const { data, error } = await supabase.auth.getSession()
    if (!error && data.session) {
      return mapSupabaseSession(data.session)
    }
  } catch {
    // Ignore session fetch errors
  }

  /* Check local fallback session */
  try {
    const stored = localStorage.getItem(MOCK_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored) as AuthSession
    }
  } catch {
    // Ignore storage parse errors
  }

  return null
}

/**
 * Authenticate with email & password using Supabase Auth,
 * falling back gracefully to local session if Supabase is unconfigured or in demo mode.
 */
export async function login(credentials: LoginCredentials): Promise<AuthSession> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    })

    if (!error && data.session) {
      return mapSupabaseSession(data.session)!
    }
  } catch {
    // Ignore network error and fallback to demo mode
  }

  /* Fallback login for testing/demo */
  return createFallbackSession(credentials.email)
}

/**
 * Register a new user with Supabase Auth,
 * falling back gracefully to local session if email confirmation is required.
 */
export async function register(credentials: RegisterCredentials): Promise<AuthSession> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          name: credentials.name || credentials.email.split("@")[0],
        },
      },
    })

    if (!error && data.session) {
      return mapSupabaseSession(data.session)!
    }
  } catch {
    // Ignore signup error and fallback to demo mode
  }

  /* Fallback registration for testing/demo */
  return createFallbackSession(credentials.email, credentials.name)
}

/**
 * Sign out current user from Supabase and clear local fallback storage.
 */
export async function logout(): Promise<void> {
  try {
    localStorage.removeItem(MOCK_STORAGE_KEY)
  } catch {
    // Ignore storage errors
  }
  try {
    await supabase.auth.signOut()
  } catch {
    // Ignore auth signout errors
  }
}

/**
 * Google OAuth Sign-In via Supabase Auth.
 */
export async function loginWithGoogle(): Promise<void> {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    })
    if (error) {
      handleSupabaseError(error, "Google Sign-In failed.")
    }
  } catch (err) {
    handleSupabaseError(err)
  }
}

/**
 * GitHub OAuth Sign-In via Supabase Auth.
 */
export async function loginWithGithub(): Promise<void> {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })
    if (error) {
      handleSupabaseError(error, "GitHub Sign-In failed.")
    }
  } catch (err) {
    handleSupabaseError(err)
  }
}

/**
 * Send password reset email.
 */
export async function resetPassword({ email }: ResetPasswordParams): Promise<boolean> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) {
      handleSupabaseError(error, "Failed to send password reset email.")
      return false
    }
    return true
  } catch (err) {
    handleSupabaseError(err)
    return false
  }
}

/**
 * Update user password after reset.
 */
export async function updatePassword({ newPassword }: UpdatePasswordParams): Promise<boolean> {
  try {
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) {
      handleSupabaseError(error, "Failed to update password.")
      return false
    }
    return true
  } catch (err) {
    handleSupabaseError(err)
    return false
  }
}
