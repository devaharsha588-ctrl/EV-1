import { createClient } from "@supabase/supabase-js"
import { toast } from "sonner"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? ""
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ""

if (!supabaseUrl || !supabaseAnonKey) {
  if (typeof window !== "undefined") {
    console.warn(
      "[Supabase] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY missing from environment variables.",
    )
  }
}

/**
 * Single configured Supabase client instance.
 * All authentication, database, real-time, and storage calls use this client.
 */
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key",
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  },
)

/**
 * Reusable Supabase error helper.
 * Displays toast notifications using Sonner and prevents crashes.
 */
export function handleSupabaseError(
  error: unknown,
  fallbackMessage = "An unexpected database error occurred.",
): string {
  console.error("[Supabase Error]:", error)

  let message = fallbackMessage

  if (error && typeof error === "object") {
    if ("message" in error && typeof error.message === "string") {
      message = error.message
    }
  }

  /* Handle specific failure cases gracefully */
  if (message.includes("Failed to fetch") || message.includes("NetworkError")) {
    message = "Network error: Please check your internet connection."
  } else if (message.includes("JWT expired") || message.includes("invalid claim")) {
    message = "Your session has expired. Please sign in again."
  } else if (message.includes("Permission denied") || message.includes("row-level security")) {
    message = "Access restricted by security policy."
  }

  if (typeof window !== "undefined") {
    toast.error(message)
  }

  return message
}
