import type { User, Session } from "@supabase/supabase-js"

export interface AuthUser {
  readonly id: string
  readonly avatarUrl?: string
  readonly email?: string
  readonly name?: string
  readonly role?: string
}

export interface AuthSession {
  readonly accessToken?: string
  readonly refreshToken?: string
  readonly user?: AuthUser
  readonly rawSession?: Session | null
  readonly rawUser?: User | null
}

export interface LoginCredentials {
  readonly email: string
  readonly password: string
}

export interface RegisterCredentials {
  readonly email: string
  readonly password: string
  readonly name?: string
}

export interface ResetPasswordParams {
  readonly email: string
}

export interface UpdatePasswordParams {
  readonly newPassword: string
}

export type LoginRequestDto = LoginCredentials | Record<string, unknown>
export type RegisterRequestDto = RegisterCredentials | Record<string, unknown>
