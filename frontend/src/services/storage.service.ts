import { supabase, handleSupabaseError } from "@/lib/supabase"

/**
 * Storage helpers using Supabase Storage buckets:
 * - avatars
 * - resumes
 * - portfolios
 *
 * Assumes buckets already exist with RLS policies enabled.
 */

export async function uploadAvatar(userId: string, file: File): Promise<string | null> {
  try {
    const fileExt = file.name.split(".").pop()
    const filePath = `${userId}/avatar-${Date.now()}.${fileExt}`

    const { error } = await supabase.storage.from("avatars").upload(filePath, file, {
      upsert: true,
    })

    if (error) {
      handleSupabaseError(error, "Failed to upload avatar.")
      return null
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath)
    return data.publicUrl
  } catch (err) {
    handleSupabaseError(err)
    return null
  }
}

export async function uploadResumeFile(userId: string, file: File): Promise<string | null> {
  try {
    const fileExt = file.name.split(".").pop()
    const filePath = `${userId}/resume-${Date.now()}.${fileExt}`

    const { error } = await supabase.storage.from("resumes").upload(filePath, file, {
      upsert: true,
    })

    if (error) {
      handleSupabaseError(error, "Failed to upload resume file.")
      return null
    }

    const { data } = supabase.storage.from("resumes").getPublicUrl(filePath)
    return data.publicUrl
  } catch (err) {
    handleSupabaseError(err)
    return null
  }
}

export async function uploadPortfolioFile(userId: string, file: File): Promise<string | null> {
  try {
    const fileExt = file.name.split(".").pop()
    const filePath = `${userId}/portfolio-${Date.now()}.${fileExt}`

    const { error } = await supabase.storage.from("portfolios").upload(filePath, file, {
      upsert: true,
    })

    if (error) {
      handleSupabaseError(error, "Failed to upload portfolio document.")
      return null
    }

    const { data } = supabase.storage.from("portfolios").getPublicUrl(filePath)
    return data.publicUrl
  } catch (err) {
    handleSupabaseError(err)
    return null
  }
}
