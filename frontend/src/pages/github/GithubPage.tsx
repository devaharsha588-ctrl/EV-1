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

  const STATS = [
    { label: "REPOSITORIES", value: data.repositoriesCount.toString(), sub: "Public repos", icon: GitBranch },
    { label: "TOTAL STARS", value: data.totalStars.toString(), sub: "Across public repos", icon: Star },
    { label: "CONTRIBUTIONS", value: data.contributions.toLocaleString(), sub: "Indexed this year", icon: GitCommit },
    { label: "LONGEST STREAK", value: `${data.longestStreak} days`, sub: "Personal best", icon: Flame },
  ]

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <PageHeader
        label="GITHUB INTELLIGENCE"
        title="Code Activity"
        description="Real-time analysis of your code quality, language velocity, and contribution consistency."
      />

      {/* GitHub URL Banner */}
      <div className="rounded-[4px] border border-black/[0.07] bg-white flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black rounded-[3px] flex items-center justify-center shrink-0">
            <GitBranch className="size-3.5 text-white" />
          </div>
          <div>
            <p className="font-mono text-[12px] font-bold text-[#000000]">{data.githubUrl}</p>
            <p className="font-mono text-[10px] text-[#526E7A] tracking-wider mt-0.5">
              {loading ? "SYNCING..." : `SYNCHRONIZED // ${data.syncedTime.toUpperCase()}`}
              {isReal && <span className="ml-2 text-[#10B981]">● LIVE DATA</span>}
            </p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-[3px] px-3 py-1.5 label-mono ${
          loading ? "bg-[#F5F5F5] text-[#526E7A]" : isReal ? "bg-[#10B981]/10 text-[#10B981]" : "bg-[#F5F5F5] text-[#526E7A]"
        }`}>
          {loading ? <Loader2 className="size-3 animate-spin" /> : <CheckCircle className="size-3" />}
          {loading ? "SYNCING" : isReal ? "LIVE" : "ESTIMATED"}
        </span>
      </div>

      {/* Notices */}
      {error && (
        <div className="flex items-center gap-2 text-xs text-[#526E7A] bg-[#F5F5F5] border border-black/[0.07] rounded-[4px] px-4 py-2">
          <AlertCircle className="size-3.5 shrink-0" />
          {error}
        </div>
      )}
      {!profile.githubUrl && (
        <div className="flex items-center gap-2 text-xs text-[#526E7A] bg-[#F5F5F5] border border-black/[0.07] rounded-[4px] px-4 py-3">
          <AlertCircle className="size-3.5 shrink-0 text-[#3B82F6]" />
          Add your GitHub URL in{" "}
          <a href="/settings" className="text-[#3B82F6] underline ml-1">Settings → Profile</a>{" "}
          to see live GitHub data.
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="space-y-2 p-5 gap-0">
              <div className="flex justify-between items-center">
                <span className="label-mono">{stat.label}</span>
                <Icon className="size-3.5 text-[#526E7A]" />
              </div>
              <p className="font-mono text-[32px] font-bold text-[#000000] leading-none mt-2">{stat.value}</p>
              <p className="text-[11px] text-[#526E7A] mt-1">{stat.sub}</p>
            </Card>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Contribution History */}
        <Card className="space-y-4 p-6 lg:col-span-2 gap-0">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h2 className="label-mono text-black">CONTRIBUTION HISTORY</h2>
              <p className="text-xs text-[#526E7A] mt-1">{isReal ? "Live data from GitHub API" : "Estimated metrics"}</p>
            </div>
          </div>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.activityData}>
                <defs>
                  <linearGradient id="areaGradN" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#000000" stopOpacity={0.08} />
                    <stop offset="95%" stopColor="#000000" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#526E7A" fontSize={10} fontFamily="Space Mono" />
                <YAxis stroke="#526E7A" fontSize={10} fontFamily="Space Mono" />
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid rgba(0,0,0,0.08)",
                    borderRadius: "4px",
                    fontSize: "11px",
                    fontFamily: "Space Mono",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="contributions"
                  stroke="#000000"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#areaGradN)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Language Breakdown */}
        <Card className="space-y-4 p-6 gap-0">
          <h2 className="label-mono text-black">LANGUAGE BREAKDOWN</h2>
          <div className="h-40 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.langData} dataKey="value" innerRadius={35} outerRadius={60} paddingAngle={3}>
                  {data.langData.map((entry, index) => {
                    const fallbackColors = ["#000000", "#3B82F6", "#526E7A", "#10B981", "#94A3B8"]
                    const color = entry.color || fallbackColors[index % fallbackColors.length]
                    return <Cell key={`cell-${index}`} fill={color} />
                  })}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid rgba(0,0,0,0.08)",
                    borderRadius: "4px",
                    fontSize: "11px",
                    fontFamily: "Space Mono",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            {data.langData.map((l) => (
              <div key={l.name} className="flex items-center gap-1.5 text-xs">
                <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: l.color }} />
                <span className="font-mono text-[10px] text-[#526E7A] truncate">{l.name} ({l.value}%)</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* AI Insights */}
      <Card aiActive className="p-6 gap-0">
        <span className="label-mono text-[#3B82F6] block mb-3">AI CODEBASE INSIGHTS</span>
        <div className="space-y-2">
          {data.aiInsights.map((insight, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-sm text-[#000000]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] shrink-0 mt-1.5" />
              <span className="leading-relaxed">{insight}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
