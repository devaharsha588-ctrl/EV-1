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
      streakDays: Math.min(60, Math.max(1, knownCount * 3 + Math.floor(hours / 2))),
      resumeScore: profile.resumeUrl
        ? Math.min(98, 70 + knownCount * 3 + (profile.linkedinUrl ? 5 : 0))
        : Math.min(80, 55 + knownCount * 2),
      githubStars: profile.githubUrl
        ? Math.min(500, Math.max(10, knownCount * 20 + hours * 5))
        : 0,
      githubContributions: profile.githubUrl
        ? Math.min(4500, Math.max(120, knownCount * 180 + hours * 25))
        : 0,
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

    const completedMilestones = phases.flatMap(p => p.milestones).filter(m => m.status === "completed").length
    const totalMilestones = phases.flatMap(p => p.milestones).length
    const overallProgress = Math.round((completedMilestones / totalMilestones) * 100)
    const currentPhase = phases.find(p => p.status === "current") || phases[0]

    return {
      overallProgress,
      currentPhaseTitle: currentPhase.title,
      finishedMilestonesCount: completedMilestones,
      totalMilestonesCount: totalMilestones,
      aiRecommendation: `Invest ${profile.weeklyHours || 10} hours this week in ${currentPhase.title} to remain on target for ${goal}.`,
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

    const techs = profile.knownTechnologies
    const hours = profile.weeklyHours || 10
    const repoCount = Math.max(2, techs.length + 1)
    const weeklyCommits = Math.round(hours * 1.5)
    const colors = ["#8B5CF6", "#4338CA", "#10B981", "#F59E0B", "#EF4444", "#3B82F6"]

    // Build last 6 months dynamic from current month
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    const now = new Date()
    const activityData = Array.from({ length: 6 }, (_, i) => {
      const monthIdx = (now.getMonth() - 5 + i + 12) % 12
      const base = Math.round(weeklyCommits * 4 * (0.6 + Math.random() * 0.8))
      return { month: months[monthIdx], contributions: Math.max(10, base) }
    })

    const langData = techs.length > 0
      ? [
          ...techs.slice(0, 3).map((t, i) => ({ name: t, value: Math.round(70 / (i + 1) * (i === 0 ? 1 : 0.6)), color: colors[i] })),
          { name: "Other", value: 10, color: colors[3] },
        ]
      : [
          { name: "JavaScript", value: 45, color: colors[0] },
          { name: "HTML/CSS", value: 25, color: colors[1] },
          { name: "Other", value: 30, color: colors[2] },
        ]

    return {
      githubUrl: profile.githubUrl || `https://github.com/${githubHandle}`,
      syncedTime: "Just now",
      repositoriesCount: repoCount,
      totalStars: profile.githubUrl ? Math.max(5, repoCount * Math.round(hours * 0.8)) : 0,
      contributions: profile.githubUrl ? Math.max(50, techs.length * 120 + hours * 15) : 0,
      longestStreak: Math.max(3, Math.round(hours * 1.2)),
      activityData,
      langData,
      aiInsights: [
        `Pin your top ${techs[0] || "projects"} repositories to showcase your skills for "${profile.primaryGoal || "your goal"}".`,
        `Commit ${weeklyCommits}+ times/week to match your ${hours}h/week study goal and build a strong contribution graph.`,
        techs.length > 1 ? `Your ${techs[1]} skills are in high demand — highlight them in your repo descriptions.` : "Add README files to all repositories to increase profile engagement.",
      ],
    }
  },

  generateAnalyticsData(profile: UserProfile): AnalyticsData {
    const hours = profile.weeklyHours || 10
    const knownCount = profile.knownTechnologies.length

    // Weekly hours directly drives learning hours shown (hours * weeks active)
    const weeksActive = Math.max(1, Math.min(12, knownCount + 2))
    const totalLearningHours = hours * weeksActive
    const modulesFinished = Math.max(1, Math.floor(knownCount * 1.5) + Math.floor(hours / 5))
    const streakDays = Math.max(1, Math.min(90, knownCount * 4 + Math.floor(hours / 2)))

    // Base score calculation based on skill level
    const baseScore = profile.skillLevel === "Expert" ? 70
      : profile.skillLevel === "Advanced" ? 58
      : profile.skillLevel === "Intermediate" ? 45
      : 30

    // Time-range filtered historical score datasets
    const weekData = [
      { label: "Mon", score: Math.min(98, baseScore + Math.round(hours * 0.2)) },
      { label: "Tue", score: Math.min(98, baseScore + Math.round(hours * 0.35)) },
      { label: "Wed", score: Math.min(98, baseScore + Math.round(hours * 0.4)) },
      { label: "Thu", score: Math.min(98, baseScore + Math.round(hours * 0.55)) },
      { label: "Fri", score: Math.min(98, baseScore + Math.round(hours * 0.7)) },
      { label: "Sat", score: Math.min(98, baseScore + Math.round(hours * 0.85)) },
      { label: "Sun", score: Math.min(98, baseScore + Math.round(hours * 1.0)) },
    ]

    const monthData = [
      { label: "W1", score: Math.min(98, baseScore) },
      { label: "W2", score: Math.min(98, baseScore + Math.round(hours * 0.6)) },
      { label: "W3", score: Math.min(98, baseScore + Math.round(hours * 1.2)) },
      { label: "W4", score: Math.min(98, baseScore + Math.round(hours * 1.8 + knownCount * 1.5)) },
    ]

    const allTimeData = [
      { label: "Jan", score: Math.max(25, baseScore - 20) },
      { label: "Feb", score: Math.max(30, baseScore - 15) },
      { label: "Mar", score: Math.max(38, baseScore - 8) },
      { label: "Apr", score: Math.max(45, baseScore - 2) },
      { label: "May", score: Math.min(95, baseScore + Math.round(hours * 1.2)) },
      { label: "Jun", score: Math.min(98, baseScore + Math.round(hours * 2.0 + knownCount * 2)) },
    ]

    const techs = profile.knownTechnologies.length > 0
      ? profile.knownTechnologies
      : profile.interests.length > 0
      ? profile.interests
      : ["Core Engineering"]

    const skillBreakdown = techs.slice(0, 6).map((skill, i) => ({
      skill,
      progress: Math.min(96, Math.max(20, 90 - i * 12 + Math.floor(hours * 0.5))),
    }))

    const weeksToGoal = Math.max(2, Math.round((120 - knownCount * 8) / hours))

    return {
      learningHours: totalLearningHours,
      modulesFinished,
      skillsLeveledCount: Math.max(1, knownCount),
      studyStreakDays: streakDays,
      scoreHistory: monthData, // Default month dataset
      scoreHistoryFiltered: {
        week: weekData,
        month: monthData,
        all: allTimeData,
      },
      skillBreakdown,
      aiSummary: `At your ${hours}h/week commitment with ${knownCount} indexed skill${knownCount !== 1 ? "s" : ""}, you are projected to achieve "${profile.primaryGoal || "your goal"}" in ~${weeksToGoal} weeks. Keep your study streak active to accelerate velocity.`,
    }
  },
}
