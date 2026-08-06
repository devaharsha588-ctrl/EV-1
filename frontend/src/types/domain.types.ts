import type { UnknownRecord } from "@/types/api.types"

// Dto type aliases for backend services
export type AnalyticsOverviewDto = UnknownRecord
export type ChatThreadListDto = UnknownRecord
export type DashboardSummaryDto = UnknownRecord
export type GithubAnalysisDto = UnknownRecord
export type ProfileDto = UnknownRecord
export type ResumeWorkspaceDto = UnknownRecord
export type RoadmapDto = UnknownRecord

// Domain data contracts
export interface SkillVelocityItem {
  readonly name: string
  readonly progress: number
  readonly level: string
}

export interface ActivityItem {
  readonly id: string
  readonly text: string
  readonly time: string
  readonly type: "success" | "primary" | "accent" | "muted"
}

export interface DashboardData {
  readonly user: {
    readonly name: string
    readonly nickname?: string
    readonly avatarUrl?: string
  }
  readonly currentRole: string
  readonly primaryGoal: string
  readonly weeklyHours: number
  readonly skillLevel: string
  readonly interests: string[]
  readonly careerScore: number
  readonly streakDays: number
  readonly resumeScore: number
  readonly githubStars: number
  readonly githubContributions: number
  readonly skillVelocity: SkillVelocityItem[]
  readonly aiSummary: string
  readonly todayPriority: string
  readonly progressHistory: Array<{ readonly week: string; readonly score: number }>
  readonly recentActivities: ActivityItem[]
}

export interface RoadmapMilestone {
  readonly id: string
  readonly title: string
  readonly status: "completed" | "current" | "upcoming"
  readonly desc: string
  readonly estimatedTime: string
}

export interface RoadmapPhase {
  readonly id: string
  readonly title: string
  readonly status: "completed" | "current" | "upcoming"
  readonly progress: number
  readonly milestones: RoadmapMilestone[]
}

export interface RoadmapData {
  readonly overallProgress: number
  readonly currentPhaseTitle: string
  readonly finishedMilestonesCount: number
  readonly totalMilestonesCount: number
  readonly aiRecommendation: string
  readonly phases: RoadmapPhase[]
}

export interface ResumeData {
  readonly summary: string
  readonly atsScore: number
  readonly matchStatus: string
  readonly aiSuggestions: string[]
  readonly skills: string[]
  readonly experiences: Array<{
    readonly title: string
    readonly company: string
    readonly dates: string
    readonly description: string
  }>
}

export interface GithubData {
  readonly githubUrl: string
  readonly syncedTime: string
  readonly repositoriesCount: number
  readonly totalStars: number
  readonly contributions: number
  readonly longestStreak: number
  readonly activityData: Array<{ readonly month: string; readonly contributions: number }>
  readonly langData: Array<{ readonly name: string; readonly value: number; readonly color: string }>
  readonly aiInsights: string[]
}

export interface AnalyticsScoreItem {
  readonly label: string
  readonly score: number
}

export interface AnalyticsData {
  readonly learningHours: number
  readonly modulesFinished: number
  readonly skillsLeveledCount: number
  readonly studyStreakDays: number
  readonly scoreHistory: AnalyticsScoreItem[]
  readonly scoreHistoryFiltered?: {
    readonly week: AnalyticsScoreItem[]
    readonly month: AnalyticsScoreItem[]
    readonly all: AnalyticsScoreItem[]
  }
  readonly skillBreakdown: Array<{ readonly skill: string; readonly progress: number }>
  readonly aiSummary: string
}
