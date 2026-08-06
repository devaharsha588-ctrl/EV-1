export type UserType =
  | "Student"
  | "Working Professional"
  | "Career Switcher"
  | "Freelancer"
  | "Founder"
  | "Job Seeker"
  | "Other"

export type SkillLevel =
  | "Beginner"
  | "Intermediate"
  | "Advanced"
  | "Professional"

export type LearningStyle =
  | "Video"
  | "Reading"
  | "Projects"
  | "Mentorship"
  | "Practice"
  | "Mixed"

export interface UserProfile {
  name: string
  nickname?: string
  avatarUrl?: string
  userType: UserType | string
  interests: string[]
  skillLevel: SkillLevel | string
  primaryGoal: string
  weeklyHours: number
  knownTechnologies: string[]
  resumeUrl?: string
  githubUrl?: string
  linkedinUrl?: string
  portfolioUrl?: string
  learningStyle: LearningStyle | string
  isOnboardingCompleted: boolean
}
