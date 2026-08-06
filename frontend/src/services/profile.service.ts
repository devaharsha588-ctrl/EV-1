import { supabase } from "@/lib/supabase"
import type { UserProfile } from "@/types/profile.types"

const PROFILE_STORAGE_KEY = "ev_user_profile"

export const INITIAL_PROFILE: UserProfile = {
  name: "",
  nickname: "",
  avatarUrl: "",
  userType: "",
  interests: [],
  skillLevel: "",
  primaryGoal: "",
  weeklyHours: 10,
  knownTechnologies: [],
  resumeUrl: "",
  githubUrl: "",
  linkedinUrl: "",
  portfolioUrl: "",
  learningStyle: "",
  isOnboardingCompleted: false,
}

export const profileService = {
  getProfile(): UserProfile {
    try {
      const stored = localStorage.getItem(PROFILE_STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored) as UserProfile
      }
    } catch {
      // Fallback if parsing fails
    }
    return INITIAL_PROFILE
  },

  async fetchRemoteProfile(userId?: string): Promise<UserProfile> {
    const local = this.getProfile()
    if (!userId || !supabase) return local

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()

      if (!error && data) {
        const remoteProfile: UserProfile = {
          name: data.full_name || data.name || local.name,
          nickname: data.nickname || local.nickname,
          avatarUrl: data.avatar_url || local.avatarUrl,
          userType: data.user_type || local.userType,
          interests: Array.isArray(data.interests) ? data.interests : local.interests,
          skillLevel: data.skill_level || local.skillLevel,
          primaryGoal: data.primary_goal || local.primaryGoal,
          weeklyHours: typeof data.weekly_hours === "number" ? data.weekly_hours : local.weeklyHours,
          knownTechnologies: Array.isArray(data.known_technologies) ? data.known_technologies : local.knownTechnologies,
          resumeUrl: data.resume_url || local.resumeUrl,
          githubUrl: data.github_url || local.githubUrl,
          linkedinUrl: data.linkedin_url || local.linkedinUrl,
          portfolioUrl: data.portfolio_url || local.portfolioUrl,
          learningStyle: data.learning_style || local.learningStyle,
          isOnboardingCompleted: Boolean(data.is_onboarding_completed || local.isOnboardingCompleted),
        }
        this.saveProfileToStorage(remoteProfile)
        return remoteProfile
      }
    } catch {
      // Use local state if remote fetch fails
    }

    return local
  },

  saveProfileToStorage(profile: UserProfile): void {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile))
    } catch {
      // LocalStorage save error catch
    }
  },

  async updateProfile(updates: Partial<UserProfile>, userId?: string): Promise<UserProfile> {
    const current = this.getProfile()
    const updated: UserProfile = {
      ...current,
      ...updates,
    }

    this.saveProfileToStorage(updated)

    if (userId && supabase) {
      try {
        await supabase.from("profiles").upsert({
          id: userId,
          full_name: updated.name,
          nickname: updated.nickname,
          avatar_url: updated.avatarUrl,
          user_type: updated.userType,
          interests: updated.interests,
          skill_level: updated.skillLevel,
          primary_goal: updated.primaryGoal,
          weekly_hours: updated.weeklyHours,
          known_technologies: updated.knownTechnologies,
          resume_url: updated.resumeUrl,
          github_url: updated.githubUrl,
          linkedin_url: updated.linkedinUrl,
          portfolio_url: updated.portfolioUrl,
          learning_style: updated.learningStyle,
          is_onboarding_completed: updated.isOnboardingCompleted,
          updated_at: new Date().toISOString(),
        })
      } catch {
        // Silently preserve local update if database upsert fails
      }
    }

    return updated
  },

  async completeOnboarding(profileData: Partial<UserProfile>, userId?: string): Promise<UserProfile> {
    return this.updateProfile({ ...profileData, isOnboardingCompleted: true }, userId)
  },
}
