import { useState } from "react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"
import { Clock, CheckCircle2, TrendingUp, Calendar } from "lucide-react"

import { PageHeader } from "@/components/common/PageHeader"
import { Card } from "@/components/ui/card"
import { useProfile } from "@/hooks/useProfile"

const FILTER_LABELS = { week: "THIS WEEK", month: "THIS MONTH", all: "ALL TIME" }

export default function AnalyticsPage() {
  const { analyticsData } = useProfile()
  const [filter, setFilter] = useState<"week" | "month" | "all">("month")

  const STAT_CARDS = [
    { label: "LEARNING HOURS", value: `${analyticsData.learningHours}h`, sub: "Total hours logged", icon: Clock },
    { label: "MODULES FINISHED", value: analyticsData.modulesFinished.toString(), sub: "In milestone roadmap", icon: CheckCircle2 },
    { label: "SKILLS LEVELED", value: analyticsData.skillsLeveledCount.toString(), sub: "Indexed technologies", icon: TrendingUp },
    { label: "STUDY STREAK", value: `${analyticsData.studyStreakDays} days`, sub: "Active now", icon: Calendar },
  ]

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto px-4 sm:px-6 py-8">

      {/* Header Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <PageHeader
          label="LEARNING ANALYTICS"
          title="Skill Trajectory"
          description="Track growth velocity, skill improvements, and milestone progression."
        />
        {/* Filter Tabs */}
        <div className="bg-white border border-black/[0.08] rounded-[4px] p-1 flex gap-0.5 self-start sm:self-auto shrink-0">
          {(["week", "month", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 font-mono text-[10px] font-bold rounded-[3px] tracking-widest uppercase transition-all ${
                filter === f
                  ? "bg-black text-white"
                  : "text-[#526E7A] hover:text-black"
              }`}
            >
              {FILTER_LABELS[f]}
            </button>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STAT_CARDS.map((s) => {
          const Icon = s.icon
          return (
            <Card key={s.label} className="space-y-2 p-5 gap-0">
              <div className="flex justify-between items-center">
                <span className="label-mono">{s.label}</span>
                <Icon className="size-3.5 text-[#526E7A]" />
              </div>
              <p className="font-mono text-[32px] font-bold text-[#000000] leading-none mt-2">{s.value}</p>
              <p className="text-[11px] text-[#526E7A] mt-1">{s.sub}</p>
            </Card>
          )
        })}
      </div>

      {/* Charts */}
      <div className="space-y-6">

        {/* Score Velocity Chart */}
        <Card className="space-y-4 p-6 gap-0">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h2 className="label-mono text-black">CAREER SCORE VELOCITY</h2>
              <p className="text-xs text-[#526E7A] mt-1">Historical score progression</p>
            </div>
            <span className="label-mono text-[#10B981]">ACTIVE VELOCITY</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData.scoreHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="month" stroke="#526E7A" fontSize={10} fontFamily="Space Mono" />
                <YAxis stroke="#526E7A" fontSize={10} fontFamily="Space Mono" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid rgba(0,0,0,0.08)",
                    borderRadius: "4px",
                    fontSize: "11px",
                    fontFamily: "Space Mono",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#000000"
                  strokeWidth={2}
                  dot={{ fill: "#000", r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 4, fill: "#3B82F6" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Skill Breakdown Bar Chart */}
        <Card className="space-y-4 p-6 gap-0">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h2 className="label-mono text-black">SKILL BREAKDOWN</h2>
              <p className="text-xs text-[#526E7A] mt-1">Proficiency across indexed technologies</p>
            </div>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.skillBreakdown} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis dataKey="skill" stroke="#526E7A" fontSize={10} fontFamily="Space Mono" />
                <YAxis stroke="#526E7A" fontSize={10} fontFamily="Space Mono" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid rgba(0,0,0,0.08)",
                    borderRadius: "4px",
                    fontSize: "11px",
                    fontFamily: "Space Mono",
                  }}
                />
                <Bar dataKey="level" fill="#000000" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  )
}
