import type {
  DashboardData,
  RoadmapData,
  ResumeData,
  GithubData,
  AnalyticsData,
  SkillVelocityItem,
  RoadmapPhase,
} from "@/types/domain.types"
import type { UserProfile } from "@/types/profile.types"

export const generatorService = {
  generateDashboardData(profile: UserProfile): DashboardData {
    const displayName = profile.nickname?.trim() || profile.name.trim() || "Learner"
    const goal = profile.primaryGoal || "Career Growth & Skill Velocity"
    const userRole = profile.userType || "Developer & Learner"
    const knownCount = profile.knownTechnologies.length
    const hours = profile.weeklyHours || 10

    // Dynamic Career Score calculation
    const calculatedScore = Math.min(
      98,
      Math.max(
        45,
        50 +
          Math.min(25, knownCount * 4) +
          (hours >= 20 ? 12 : hours >= 10 ? 7 : 3) +
          (profile.githubUrl ? 6 : 0) +
          (profile.resumeUrl ? 5 : 0),
      ),
    )

    // Dynamic skill velocity
    const defaultTechs = profile.knownTechnologies.length > 0
      ? profile.knownTechnologies
      : profile.interests.length > 0
      ? profile.interests
      : ["Core Engineering", "Problem Solving", "System Architecture"]

    const skillVelocity: SkillVelocityItem[] = defaultTechs.slice(0, 3).map((tech, i) => ({
      name: tech,
      progress: Math.min(95, Math.max(35, 75 - i * 12 + knownCount * 2)),
      level: profile.skillLevel || (i === 0 ? "Intermediate" : "Learning"),
    }))

    const mainInterest = profile.interests[0] || "Software Engineering"

    return {
      user: {
        name: displayName,
        nickname: profile.nickname,
        avatarUrl: profile.avatarUrl,
      },
      currentRole: userRole,
      primaryGoal: goal,
      weeklyHours: hours,
      skillLevel: profile.skillLevel || "Intermediate",
      interests: profile.interests.length > 0 ? profile.interests : ["Full Stack Development"],
      careerScore: calculatedScore,
      streakDays: Math.min(30, Math.max(3, knownCount * 2 + 5)),
      resumeScore: profile.resumeUrl ? 84 : 72,
      githubStars: profile.githubUrl ? 124 : 45,
      githubContributions: Math.min(4500, Math.max(120, knownCount * 180 + hours * 25)),
      skillVelocity,
      aiSummary: `Welcome ${displayName}! You are currently tracking toward your goal: "${goal}". Based on your target velocity of ${hours} hours/week, EV AI has optimized your focus on ${mainInterest}.`,
      todayPriority: `Master core ${mainInterest} fundamentals & build targeted portfolio items for "${goal}".`,
      progressHistory: [
        { week: "W1", score: Math.max(30, calculatedScore - 30) },
        { week: "W2", score: Math.max(40, calculatedScore - 20) },
        { week: "W3", score: Math.max(50, calculatedScore - 12) },
        { week: "W4", score: Math.max(60, calculatedScore - 5) },
        { week: "W5", score: calculatedScore },
      ],
      recentActivities: [
        {
          id: "act-1",
          text: `Completed onboarding & defined target goal: ${goal}`,
          time: "Just now",
          type: "success",
        },
        {
          id: "act-2",
          text: `Indexed ${knownCount} technologies for ${mainInterest}`,
          time: "1 hour ago",
          type: "primary",
        },
        {
          id: "act-3",
          text: `Generated milestone roadmap for ${hours} hours/week commitment`,
          time: "Today",
          type: "accent",
        },
      ],
    }
  },

  generateRoadmapData(profile: UserProfile): RoadmapData {
    const goal = profile.primaryGoal || "Software Engineer"
    const mainInterest = profile.interests[0] || "Software Engineering"
    const known = profile.knownTechnologies

    const phases: RoadmapPhase[] = [
      {
        id: "phase-1",
        title: `Phase 1: Foundations & Core ${mainInterest}`,
        status: "completed",
        progress: 100,
        milestones: [
          {
            id: "m-1",
            title: `Core Fundamentals & Specifications (${known[0] || mainInterest})`,
            status: "completed",
            desc: `Master core concepts, syntax, and architecture patterns for ${mainInterest}.`,
            estimatedTime: "Completed",
          },
          {
            id: "m-2",
            title: "Version Control & Collaborative Git Engineering",
            status: "completed",
            desc: "Branching strategies, pull requests, and repository setup.",
            estimatedTime: "Completed",
          },
        ],
      },
      {
        id: "phase-2",
        title: `Phase 2: Advanced ${goal} Architecture`,
        status: "current",
        progress: 65,
        milestones: [
          {
            id: "m-3",
            title: `System Architecture & ${known[1] || "Framework Mastery"}`,
            status: "completed",
            desc: `Design modular components and data flows optimized for ${goal}.`,
            estimatedTime: "Completed",
          },
          {
            id: "m-4",
            title: `Hands-on Project Building for ${goal}`,
            status: "current",
            desc: `Build a production-grade portfolio application targeted at ${goal}.`,
            estimatedTime: `${Math.max(1, Math.round(15 / (profile.weeklyHours || 10)))} weeks left`,
          },
          {
            id: "m-5",
            title: "Performance Optimization & Automated Testing",
            status: "upcoming",
            desc: "Unit testing, integration pipelines, and Web Vitals benchmarking.",
            estimatedTime: "1-2 weeks",
          },
        ],
      },
      {
        id: "phase-3",
        title: `Phase 3: Career Launch & ${goal} Placement`,
        status: "upcoming",
        progress: 0,
        milestones: [
          {
            id: "m-6",
            title: "ATS Resume Tuning & Portfolio Polish",
            status: "upcoming",
            desc: `Align resume impact metrics directly with ${goal} job specifications.`,
            estimatedTime: "2 weeks",
          },
          {
            id: "m-7",
            title: "Interview Practice & System Design Challenges",
            status: "upcoming",
            desc: "Mock interviews, coding challenges, and system design drills.",
            estimatedTime: "3 weeks",
          },
        ],
      },
    ]

    return {
      overallProgress: 55,
      currentPhaseTitle: `Phase 2: Advanced ${goal} Architecture`,
      finishedMilestonesCount: 3,
      totalMilestonesCount: 7,
      aiRecommendation: `Invest ${profile.weeklyHours || 10} hours this week in Phase 2 project building to remain on target for ${goal}.`,
      phases,
    }
  },

  generateResumeData(profile: UserProfile): ResumeData {
    const goal = profile.primaryGoal || "Software Developer"
    const displayName = profile.nickname || profile.name || "Learner"
    const mainTech = profile.knownTechnologies[0] || "Modern Web Specs"

    return {
      summary: `Motivated ${profile.userType || "Engineer"} ${displayName} dedicated to ${goal}. Proficient in ${profile.knownTechnologies.join(", ") || "core development stack"} with focus on high-impact scalable solutions.`,
      atsScore: profile.resumeUrl ? 84 : 72,
      matchStatus: profile.resumeUrl ? "High Match" : "Good Match",
      aiSuggestions: [
        `Add quantified metrics to your experiences to boost your match for ${goal} roles.`,
        `Emphasize hands-on experience with ${mainTech} in your top summary section.`,
        `Include links to your GitHub and live project deployments.`,
      ],
      skills: profile.knownTechnologies.length > 0 ? profile.knownTechnologies : ["JavaScript", "React", "Git"],
      experiences: [
        {
          title: profile.userType || "Developer",
          company: "Independent / Project Portfolio",
          dates: "2024 - Present",
          description: `Built full-stack applications utilizing ${profile.knownTechnologies.slice(0, 3).join(", ") || mainTech}. Optimized application performance and user accessibility.`,
        },
      ],
    }
  },

  generateGithubData(profile: UserProfile): GithubData {
    const githubHandle = profile.githubUrl
      ? profile.githubUrl.replace(/https?:\/\/(www\.)?github\.com\/?/, "")
      : (profile.name || "learner").toLowerCase().replace(/\s+/g, "")

    return {
      githubUrl: profile.githubUrl || `https://github.com/${githubHandle}`,
      syncedTime: "2h ago",
      repositoriesCount: Math.max(3, profile.knownTechnologies.length + 2),
      totalStars: profile.githubUrl ? 124 : 45,
      contributions: Math.max(150, profile.knownTechnologies.length * 120 + profile.weeklyHours * 15),
      longestStreak: 18,
      activityData: [
        { month: "Mar", contributions: 45 },
        { month: "Apr", contributions: 78 },
        { month: "May", contributions: 92 },
        { month: "Jun", contributions: 67 },
        { month: "Jul", contributions: 134 },
        { month: "Aug", contributions: 89 },
      ],
      langData: [
        { name: profile.knownTechnologies[0] || "TypeScript", value: 45, color: "#8B5CF6" },
        { name: profile.knownTechnologies[1] || "JavaScript", value: 25, color: "#4338CA" },
        { name: profile.knownTechnologies[2] || "HTML/CSS", value: 20, color: "#10B981" },
        { name: "Other", value: 10, color: "#F59E0B" },
      ],
      aiInsights: [
        `Pin your top projects related to ${profile.primaryGoal || "your target role"} to increase profile visibility.`,
        `Maintain a consistent commit cadence matching your ${profile.weeklyHours || 10}h/week goal.`,
      ],
    }
  },

  generateAnalyticsData(profile: UserProfile): AnalyticsData {
    const hours = profile.weeklyHours || 10
    const knownCount = profile.knownTechnologies.length

    return {
      learningHours: hours * 4,
      modulesFinished: Math.max(2, Math.floor(knownCount * 1.5)),
      skillsLeveledCount: Math.max(1, knownCount),
      studyStreakDays: 14,
      scoreHistory: [
        { week: "W1", score: 42 },
        { week: "W2", score: 51 },
        { week: "W3", score: 58 },
        { week: "W4", score: 65 },
        { week: "W5", score: 78 },
      ],
      skillBreakdown: (profile.knownTechnologies.length > 0 ? profile.knownTechnologies : ["React", "TypeScript", "Node"]).map((skill, i) => ({
        skill,
        progress: Math.min(95, 85 - i * 10),
      })),
      aiSummary: `At your target commitment of ${hours} hours/week, you are on track to achieve your goal of "${profile.primaryGoal || "Career Evolution"}" in estimated ${Math.max(4, Math.round(40 / hours))} weeks.`,
    }
  },
}
