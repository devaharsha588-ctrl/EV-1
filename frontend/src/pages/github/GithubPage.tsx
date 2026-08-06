import { useState, useEffect } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { GitBranch, Star, GitCommit, Flame, CheckCircle, Loader2, AlertCircle } from "lucide-react"

import { PageHeader } from "@/components/common/PageHeader"
import { Card } from "@/components/ui/card"
import { useProfile } from "@/hooks/useProfile"
import { fetchRealGitHubData, type RealGitHubData } from "@/services/github.service"

export default function GithubPage() {
  const { profile, githubData: estimatedData } = useProfile()
  const [realData, setRealData] = useState<RealGitHubData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!profile.githubUrl) return

    setLoading(true)
    setError(null)

    fetchRealGitHubData(profile.githubUrl)
      .then((data) => {
        if (data) setRealData(data)
        else setError("Could not load GitHub data. Showing estimated values.")
      })
      .catch(() => setError("Could not load GitHub data. Showing estimated values."))
      .finally(() => setLoading(false))
  }, [profile.githubUrl])

  // Use real data if available, fall back to estimated
  const data = realData
    ? {
        githubUrl: realData.githubUrl,
        syncedTime: realData.syncedTime,
        repositoriesCount: realData.repositoriesCount,
        totalStars: realData.totalStars,
        contributions: realData.contributions,
        longestStreak: realData.longestStreak,
        activityData: realData.activityData,
        langData: realData.langData,
        aiInsights: estimatedData.aiInsights,
      }
    : estimatedData

  const isReal = Boolean(realData)

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      <PageHeader
        title="GitHub Intelligence"
        description="Real-time analysis of your code quality, language velocity, and contribution consistency."
      />

      {/* Connection Banner */}
      <div className="rounded-xl border border-[#32D296]/30 bg-[#32D296]/5 flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-[#32D296]/10 text-[#32D296] rounded-lg p-2">
            <GitBranch className="size-4" />
          </div>
          <div>
            <p className="font-mono text-xs font-semibold text-[#F5F7FA]">{data.githubUrl}</p>
            <p className="font-mono text-[0.68rem] text-[#A7B0C0]">
              {loading ? "SYNCING..." : `SYNCHRONIZED // ${data.syncedTime.toUpperCase()}`}
              {isReal && <span className="ml-2 text-[#32D296]">● LIVE DATA</span>}
            </p>
          </div>
        </div>
        <span className="bg-[#32D296]/10 text-[#32D296] font-mono inline-flex items-center gap-1.5 self-start rounded-full px-3 py-1 text-xs font-semibold sm:self-center">
          {loading ? <Loader2 className="size-3 animate-spin" /> : <CheckCircle className="size-3" />}
          {loading ? "SYNCING" : isReal ? "LIVE" : "ESTIMATED"}
        </span>
      </div>

      {/* Error notice */}
      {error && (
        <div className="flex items-center gap-2 text-xs text-[#F59E0B] bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-lg px-4 py-2">
          <AlertCircle className="size-3.5 shrink-0" />
          {error}
        </div>
      )}

      {/* No GitHub URL notice */}
      {!profile.githubUrl && (
        <div className="flex items-center gap-2 text-xs text-[#A7B0C0] bg-white/5 border border-white/10 rounded-lg px-4 py-3">
          <AlertCircle className="size-3.5 shrink-0 text-[#5B7CFA]" />
          Add your GitHub URL in{" "}
          <a href="/settings" className="text-[#5B7CFA] underline ml-1">Settings → Profile</a> to see live GitHub data.
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "REPOSITORIES", value: data.repositoriesCount.toString(), sub: "Public repos", icon: GitBranch },
          { label: "TOTAL STARS", value: data.totalStars.toString(), sub: "across public repos", icon: Star },
          { label: "CONTRIBUTIONS", value: data.contributions.toLocaleString(), sub: "indexed this year", icon: GitCommit },
          { label: "LONGEST STREAK", value: `${data.longestStreak} days`, sub: "Personal best", icon: Flame },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="space-y-2 p-5">
              <div className="flex justify-between items-center text-[#A7B0C0]">
                <span className="font-mono text-[0.68rem] font-semibold">{stat.label}</span>
                <Icon className="size-3.5 text-[#5B7CFA]" />
              </div>
              <p className="font-mono text-3xl font-extrabold text-[#F5F7FA]">{stat.value}</p>
              <p className="text-xs text-[#A7B0C0]">{stat.sub}</p>
            </Card>
          )
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Activity Chart (2 cols) */}
        <Card className="space-y-4 p-6 lg:col-span-2">
          <div className="flex justify-between items-center">
            <h2 className="font-mono text-xs font-semibold text-[#F5F7FA]">CONTRIBUTION HISTORY</h2>
            <span className="font-mono text-xs text-[#A7B0C0]">
              {isReal ? "REAL DATA" : "HISTORICAL METRICS"}
            </span>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.activityData}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5B7CFA" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#5B7CFA" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#A7B0C0" fontSize={11} />
                <YAxis stroke="#A7B0C0" fontSize={11} />
                <Tooltip />
                <Area type="monotone" dataKey="contributions" stroke="#5B7CFA" strokeWidth={2} fillOpacity={1} fill="url(#areaGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Language Breakdown (1 col) */}
        <Card className="space-y-4 p-6">
          <h2 className="font-mono text-xs font-semibold text-[#F5F7FA]">LANGUAGE BREAKDOWN</h2>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.langData} dataKey="value" innerRadius={40} outerRadius={65} paddingAngle={4}>
                  {data.langData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            {data.langData.map((l) => (
              <div key={l.name} className="flex items-center gap-2 text-xs">
                <span className="size-2 rounded-full" style={{ backgroundColor: l.color }} />
                <span className="font-mono text-[#A7B0C0]">{l.name} ({l.value}%)</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* AI Code Insights */}
      <Card aiActive={true} className="p-6">
        <span className="font-mono text-xs font-semibold text-[#5B7CFA] uppercase block mb-2">AI Codebase Insights</span>
        <div className="space-y-2.5">
          {data.aiInsights.map((insight, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-[#F5F7FA]">
              <span className="size-1.5 rounded-full bg-[#5B7CFA] shrink-0 mt-1.5" />
              <span>{insight}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
