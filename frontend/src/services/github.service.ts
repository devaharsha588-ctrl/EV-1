import { supabase, handleSupabaseError } from "@/lib/supabase"
import type { GithubAnalysisDto } from "@/types/domain.types"

// TODO(schema): Expected github_analysis table schema:
// id (uuid, pk), user_id (uuid, references auth.users), github_username (text),
// repositories_count (int), total_stars (int), contributions_count (int), streak_days (int),
// language_breakdown (jsonb), insights (jsonb), updated_at (timestamptz)

export async function getGithubAnalysis(userId?: string): Promise<GithubAnalysisDto | null> {
  try {
    const targetId = userId || (await supabase.auth.getUser()).data.user?.id
    if (!targetId) return null

    const { data, error } = await supabase
      .from("github_analysis")
      .select("*")
      .eq("user_id", targetId)
      .maybeSingle()

    if (error) {
      handleSupabaseError(error, "Could not fetch GitHub intelligence analysis.")
      return null
    }

    return (data as GithubAnalysisDto) || null
  } catch (err) {
    handleSupabaseError(err)
    return null
  }
}

export async function syncGithubAnalysis(
  payload: Record<string, unknown>,
  userId?: string,
): Promise<GithubAnalysisDto | null> {
  try {
    const targetId = userId || (await supabase.auth.getUser()).data.user?.id
    if (!targetId) return null

    const { data, error } = await supabase
      .from("github_analysis")
      .upsert({ user_id: targetId, ...payload, updated_at: new Date().toISOString() })
      .select()
      .single()

    if (error) {
      handleSupabaseError(error, "Failed to sync GitHub analysis.")
      return null
    }

    return (data as GithubAnalysisDto) || null
  } catch (err) {
    handleSupabaseError(err)
    return null
  }
}

// ─── Real GitHub Public API ───────────────────────────────────────────────────

const LANG_COLORS: Record<string, string> = {
  JavaScript: "#F7DF1E", TypeScript: "#3178C6", Python: "#3572A5",
  Java: "#B07219", "C++": "#F34B7D", "C#": "#239120", Go: "#00ADD8",
  Rust: "#DEA584", HTML: "#E34C26", CSS: "#563D7C", Vue: "#41B883",
  PHP: "#4F5D95", Ruby: "#CC342D", Swift: "#FA7343", Kotlin: "#A97BFF",
  Dart: "#00B4AB", Shell: "#89E051",
}
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

function getLangColor(lang: string) { return LANG_COLORS[lang] || "#8B5CF6" }

function extractHandle(githubUrl: string): string | null {
  const match = githubUrl?.match(/github\.com\/([^/\s?#]+)/i)
  return match ? match[1] : null
}

function getLast6MonthLabels(): string[] {
  const now = new Date()
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
    return MONTHS[d.getMonth()]
  })
}

export interface RealGitHubData {
  repositoriesCount: number
  totalStars: number
  contributions: number
  longestStreak: number
  activityData: { month: string; contributions: number }[]
  langData: { name: string; value: number; color: string }[]
  avatarUrl: string
  followers: number
  githubUrl: string
  syncedTime: string
}

export async function fetchRealGitHubData(githubUrl: string): Promise<RealGitHubData | null> {
  const handle = extractHandle(githubUrl)
  if (!handle) return null

  try {
    const headers = { Accept: "application/vnd.github+json" }

    const [userRes, reposRes, eventsRes] = await Promise.all([
      fetch(`https://api.github.com/users/${handle}`, { headers }),
      fetch(`https://api.github.com/users/${handle}/repos?per_page=100&sort=updated`, { headers }),
      fetch(`https://api.github.com/users/${handle}/events/public?per_page=100`, { headers }),
    ])

    if (!userRes.ok) return null

    const user = await userRes.json()
    const repos = reposRes.ok ? await reposRes.json() : []
    const events = eventsRes.ok ? await eventsRes.json() : []

    // Total stars
    const totalStars = Array.isArray(repos)
      ? repos.reduce((s: number, r: { stargazers_count?: number }) => s + (r.stargazers_count || 0), 0)
      : 0

    // Language breakdown
    const langCounts: Record<string, number> = {}
    if (Array.isArray(repos)) {
      for (const repo of repos) {
        if (repo.language) langCounts[repo.language] = (langCounts[repo.language] || 0) + 1
      }
    }
    const totalLangRepos = Math.max(1, Object.values(langCounts).reduce((a, b) => a + b, 0))
    const topLangs = Object.entries(langCounts).sort((a, b) => b[1] - a[1]).slice(0, 4)
    let langData = topLangs.map(([name, count]) => ({
      name, value: Math.round((count / totalLangRepos) * 100), color: getLangColor(name),
    }))
    const usedPct = langData.reduce((s, l) => s + l.value, 0)
    if (100 - usedPct > 5) langData.push({ name: "Other", value: 100 - usedPct, color: getLangColor("Other") })
    if (langData.length === 0) langData = [{ name: "Code", value: 100, color: "#8B5CF6" }]

    // Monthly contributions from push events
    const last6 = getLast6MonthLabels()
    const monthlyMap: Record<string, number> = {}
    last6.forEach((m) => { monthlyMap[m] = 0 })
    let totalContributions = 0

    if (Array.isArray(events)) {
      for (const ev of events) {
        if (ev.type === "PushEvent") {
          const commits = ev.payload?.commits?.length || 1
          totalContributions += commits
          const monthLabel = MONTHS[new Date(ev.created_at).getMonth()]
          if (monthlyMap[monthLabel] !== undefined) monthlyMap[monthLabel] += commits
        }
      }
    }

    const activityData = last6.map((m) => ({ month: m, contributions: monthlyMap[m] || 0 }))

    // Streak from event days
    const eventDays = new Set<string>()
    if (Array.isArray(events)) {
      for (const ev of events) {
        if (ev.created_at) eventDays.add(ev.created_at.slice(0, 10))
      }
    }
    const sortedDays = Array.from(eventDays).sort().reverse()
    let streak = 0, prev: Date | null = null
    for (const day of sortedDays) {
      const d = new Date(day)
      if (!prev) { streak = 1; prev = d; continue }
      const diff = (prev.getTime() - d.getTime()) / 86400000
      if (diff <= 1.5) { streak++; prev = d } else break
    }

    return {
      repositoriesCount: user.public_repos || 0,
      totalStars,
      contributions: Math.max(totalContributions, (user.public_repos || 0) * 5),
      longestStreak: Math.max(streak, 1),
      activityData,
      langData,
      avatarUrl: user.avatar_url || "",
      followers: user.followers || 0,
      githubUrl: `https://github.com/${handle}`,
      syncedTime: "Just now",
    }
  } catch {
    return null
  }
}
