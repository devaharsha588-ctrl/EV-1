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

export default function AnalyticsPage() {
  const { analyticsData } = useProfile()
  const [filter, setFilter] = useState<"week" | "month" | "all">("month")

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <PageHeader
          title="Learning Analytics"
          description="Track growth velocity, skill improvements, and historical milestone progression."
        />
        <div className="bg-[#151922] rounded-full p-1 flex gap-1 border border-white/5 self-start sm:self-auto">
          {(["week", "month", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 font-mono text-xs font-semibold rounded-full capitalize transition-all ${
                filter === f
                  ? "bg-[#5B7CFA] text-white"
                  : "text-[#A7B0C0] hover:text-[#F5F7FA]"
              }`}
            >
              {f === "all" ? "All Time" : `This ${f}`}
            </button>
          ))}
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "LEARNING HOURS", value: `${analyticsData.learningHours}h`, sub: "Total hours logged", icon: Clock },
          { label: "MODULES FINISHED", value: analyticsData.modulesFinished.toString(), sub: "In milestone roadmap", icon: CheckCircle2 },
          { label: "SKILLS LEVELED", value: analyticsData.skillsLeveledCount.toString(), sub: "Indexed technologies", icon: TrendingUp },
          { label: "STUDY STREAK", value: `${analyticsData.studyStreakDays} days`, sub: "Active now", icon: Calendar },
        ].map((s) => {
          const Icon = s.icon
          return (
            <Card key={s.label} className="space-y-2 p-5">
              <div className="flex justify-between items-center text-[#A7B0C0]">
                <span className="font-mono text-[0.68rem] font-semibold">{s.label}</span>
                <Icon className="size-3.5 text-[#5B7CFA]" />
              </div>
              <p className="font-mono text-3xl font-extrabold text-[#F5F7FA]">{s.value}</p>
              <p className="text-xs text-[#A7B0C0]">{s.sub}</p>
            </Card>
          )
        })}
      </div>

      {/* Charts Stack */}
      <div className="space-y-6">
        {/* Line Chart: Learning Score Progression */}
        <Card className="space-y-4 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-mono text-xs font-semibold text-[#F5F7FA]">CAREER SCORE VELOCITY</h2>
              <p className="text-xs text-[#A7B0C0]">Historical score progression</p>
            </div>
            <span className="font-mono text-xs font-bold text-[#32D296]">ACTIVE VELOCITY</span>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData.scoreHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="week" stroke="#A7B0C0" fontSize={11} />
                <YAxis stroke="#A7B0C0" fontSize={11} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#5B7CFA"
                  strokeWidth={2.5}
                  dot={{ r: 3.5, fill: "#32D296" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Bar Chart: Skill Levels */}
        <Card className="space-y-4 p-6">
          <h2 className="font-mono text-xs font-semibold text-[#F5F7FA]">SKILL LEVEL BREAKDOWN</h2>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.skillBreakdown}>
                <XAxis dataKey="skill" stroke="#A7B0C0" fontSize={11} />
                <YAxis stroke="#A7B0C0" fontSize={11} />
                <Tooltip />
                <Bar dataKey="progress" fill="#7B61FF" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* AI Summary Banner */}
      <Card aiActive={true} className="p-6 space-y-2">
        <span className="font-mono text-xs font-semibold text-[#5B7CFA] uppercase block">AI Analytics Summary</span>
        <p className="text-xs font-medium text-[#F5F7FA] leading-relaxed">
          "{analyticsData.aiSummary}"
        </p>
      </Card>
    </div>
  )
}
