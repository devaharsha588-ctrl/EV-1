import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/hooks/useAuth"
import { profileService } from "@/services/profile.service"
import { generatorService } from "@/services/generator.service"
import type { UserProfile } from "@/types/profile.types"

export function useProfile() {
  const { session } = useAuth()
  const userId = session?.user?.id

  const [profile, setProfile] = useState<UserProfile>(() => {
    const local = profileService.getProfile()
    // Sync fallback name if user session has name
    if (session?.user?.name && !local.name) {
      return { ...local, name: session.user.name }
    }
    return local
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    profileService.fetchRemoteProfile(userId).then((fetchedProfile) => {
      if (isMounted) {
        // If profile name is missing, use auth user name
        const finalProfile = {
          ...fetchedProfile,
          name: fetchedProfile.name || session?.user?.name || "",
        }
        setProfile(finalProfile)
        setIsLoading(false)
      }
    })
    return () => {
      isMounted = false
    }
  }, [userId, session?.user?.name])

  const updateProfile = useCallback(
    async (updates: Partial<UserProfile>) => {
      setIsLoading(true)
      const updated = await profileService.updateProfile(updates, userId)
      setProfile(updated)
      setIsLoading(false)
      return updated
    },
    [userId],
  )

  const completeOnboarding = useCallback(
    async (onboardingData: Partial<UserProfile>) => {
      setIsLoading(true)
      const updated = await profileService.completeOnboarding(onboardingData, userId)
      setProfile(updated)
      setIsLoading(false)
      return updated
    },
    [userId],
  )

  const dashboardData = generatorService.generateDashboardData(profile)
  const roadmapData = generatorService.generateRoadmapData(profile)
  const resumeData = generatorService.generateResumeData(profile)
  const githubData = generatorService.generateGithubData(profile)
  const analyticsData = generatorService.generateAnalyticsData(profile)

  return {
    profile,
    isLoading,
    updateProfile,
    completeOnboarding,
    isOnboardingCompleted: Boolean(profile.isOnboardingCompleted),
    dashboardData,
    roadmapData,
    resumeData,
    githubData,
    analyticsData,
  }
}
