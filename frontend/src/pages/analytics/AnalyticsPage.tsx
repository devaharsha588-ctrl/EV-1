import { useState } from "react"
import { motion } from "framer-motion"
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
import { Clock, CheckCircle2, TrendingUp, Calendar, AlertCircle } from "lucide-react"

import { PageHeader } from "@/components/common/PageHeader"
import { Card } from "@/components/ui/card"
import { useProfile } from "@/hooks/useProfile"

const FILTER_LABELS = { week: "THIS WEEK", month: "THIS MONTH", all: "ALL TIME" }

export default function AnalyticsPage() {
  const { analyticsData, isLoading } = useProfile()
  const [filter, setFilter] = useState<"week" | "month" | "all">("month")

  const activeScoreData = analyticsData?.scoreHistoryFiltered
    ? analyticsData.scoreHistoryFiltered[filter]
    : analyticsData?.scoreHistory || []

  const STAT_CARDS = [
    { label: "LEARNING HOURS", value: `${analyticsData.learningHours}h`, sub: "Total hours logged", icon: Clock },
    { label: "MODULES FINISHED", value: analyticsData.modulesFinished.toString(), sub: "In milestone roadmap", icon: CheckCircle2 },
    { label: "SKILLS LEVELED", value: analyticsData.skillsLeveledCount.toString(), sub: "Indexed technologies", icon: TrendingUp },
    { label: "STUDY STREAK", value: `${analyticsData.studyStreakDays} days`, sub: "Active now", icon: Calendar },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8 pb-12 max-w-5xl mx-auto px-4 sm:px-6 py-8 min-h-[calc(100vh-64px)]"
    >
      {/* Header Row */}
      <motion.div variants={itemVariants} className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <PageHeader
          label="LEARNING ANALYTICS"
          title="Skill Trajectory"
          description="Track growth velocity, skill improvements, and milestone progression."
        />
        {/* Filter Tabs */}
        <div className="bg-white border border-black/[0.08] rounded-[4px] p-1 flex gap-0.5 self-start sm:self-auto shrink-0 shadow-sm">
          {(["week", "month", "all"] as const).map((f) => {
            const isActive = filter === f
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`relative px-3.5 py-1.5 font-mono text-[10px] font-bold rounded-[3px] tracking-widest uppercase transition-colors min-h-[36px] flex items-center justify-center cursor-pointer ${
                  isActive ? "text-white" : "text-[#526E7A] hover:text-black"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="analytics-active-tab"
                    className="absolute inset-0 bg-black rounded-[3px]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{FILTER_LABELS[f]}</span>
              </button>
            )
          })}
        </div>
      </motion.div>

      {/* Loading Skeletons */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-black/[0.04] animate-pulse rounded-[4px] border border-black/[0.06]" />
          ))}
        </div>
      ) : (
        /* Stat Cards */
        <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STAT_CARDS.map((s) => {
            const Icon = s.icon
            return (
              <motion.div key={s.label} variants={itemVariants}>
                <Card className="space-y-2 p-5 gap-0">
                  <div className="flex justify-between items-center">
                    <span className="label-mono text-[#526E7A]">{s.label}</span>
                    <Icon className="size-4 text-[#333333]" />
                  </div>
                  <p className="font-mono text-[32px] font-bold text-[#000000] leading-none mt-2">{s.value}</p>
                  <p className="text-xs text-[#526E7A] mt-1">{s.sub}</p>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      )}

      {/* Charts Stack */}
      <motion.div variants={containerVariants} className="space-y-6">

        {/* Score Velocity Chart */}
        <motion.div variants={itemVariants}>
          <Card className="space-y-4 p-6 gap-0">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="label-mono text-[#000000] font-bold text-xs">CAREER SCORE VELOCITY</h2>
                <p className="text-xs text-[#526E7A] mt-0.5">Historical score progression ({FILTER_LABELS[filter]})</p>
              </div>
              <span className="label-mono text-[#10B981] font-bold">ACTIVE VELOCITY</span>
            </div>

            {activeScoreData.length === 0 ? (
              <div className="h-56 w-full flex flex-col items-center justify-center border border-dashed border-black/10 rounded-[4px] p-6 text-center">
                <AlertCircle className="size-6 text-[#526E7A] mb-2" />
                <p className="text-sm font-semibold text-[#000000]">No score history recorded yet</p>
                <p className="text-xs text-[#526E7A] mt-1">Complete your first study session or update your profile to view velocity trends.</p>
              </div>
            ) : (
              <div className="h-60 w-full min-h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activeScoreData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                    <XAxis dataKey="label" stroke="#526E7A" fontSize={11} fontFamily="Space Mono" tickLine={false} />
                    <YAxis stroke="#526E7A" fontSize={11} fontFamily="Space Mono" domain={[0, 100]} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: "#FFFFFF",
                        border: "1px solid rgba(0,0,0,0.12)",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontFamily: "Space Mono",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      }}
                      formatter={(val: any) => [`Score: ${val}/100`, "Velocity"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#000000"
                      strokeWidth={2.5}
                      dot={{ fill: "#000000", r: 4, strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: "#3B82F6", stroke: "#FFFFFF", strokeWidth: 2 }}
                      isAnimationActive={true}
                      animationDuration={700}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Skill Breakdown Bar Chart */}
        <motion.div variants={itemVariants}>
          <Card className="space-y-4 p-6 gap-0">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="label-mono text-[#000000] font-bold text-xs">SKILL BREAKDOWN</h2>
                <p className="text-xs text-[#526E7A] mt-0.5">Proficiency across indexed technologies</p>
              </div>
            </div>
            <div className="h-60 w-full min-h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.skillBreakdown} barSize={28} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                  <XAxis dataKey="skill" stroke="#526E7A" fontSize={11} fontFamily="Space Mono" tickLine={false} />
                  <YAxis stroke="#526E7A" fontSize={11} fontFamily="Space Mono" domain={[0, 100]} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "#FFFFFF",
                      border: "1px solid rgba(0,0,0,0.12)",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontFamily: "Space Mono",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    }}
                    formatter={(val: any) => [`${val}%`, "Proficiency"]}
                  />
                  <Bar dataKey="progress" fill="#000000" radius={[4, 4, 0, 0]} isAnimationActive={true} animationDuration={800} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
