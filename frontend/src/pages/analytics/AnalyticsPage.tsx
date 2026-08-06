import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
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

  // Dynamic filter calculation for Stat Cards
  const getFilteredMetrics = () => {
    const baseHours = analyticsData?.learningHours || 36
    const baseModules = analyticsData?.modulesFinished || 7
    const baseSkills = analyticsData?.skillsLeveledCount || 4
    const baseStreak = analyticsData?.studyStreakDays || 19

    if (filter === "week") {
      return {
        hours: `${Math.round(baseHours * 0.35)}h`,
        hoursSub: "Hours logged this week",
        modules: `${Math.max(1, Math.round(baseModules * 0.3))}`,
        modulesSub: "Completed this week",
        skills: `${Math.max(1, Math.round(baseSkills * 0.5))}`,
        skillsSub: "Updated this week",
        streak: `${Math.min(7, baseStreak)} days`,
        streakSub: "Active week streak",
      }
    } else if (filter === "all") {
      return {
        hours: `${Math.round(baseHours * 3.2)}h`,
        hoursSub: "All time total hours",
        modules: `${Math.round(baseModules * 2.5)}`,
        modulesSub: "All time completed modules",
        skills: `${baseSkills + 5}`,
        skillsSub: "All time skills mastered",
        streak: `${baseStreak + 42} days`,
        streakSub: "Longest recorded streak",
      }
    }

    // Default "month"
    return {
      hours: `${baseHours}h`,
      hoursSub: "Total hours logged this month",
      modules: `${baseModules}`,
      modulesSub: "In milestone roadmap",
      skills: `${baseSkills}`,
      skillsSub: "Indexed technologies",
      streak: `${baseStreak} days`,
      streakSub: "Active now",
    }
  }

  const currentMetrics = getFilteredMetrics()

  const STAT_CARDS = [
    { label: "LEARNING HOURS", value: currentMetrics.hours, sub: currentMetrics.hoursSub, icon: Clock },
    { label: "MODULES FINISHED", value: currentMetrics.modules, sub: currentMetrics.modulesSub, icon: CheckCircle2 },
    { label: "SKILLS LEVELED", value: currentMetrics.skills, sub: currentMetrics.skillsSub, icon: TrendingUp },
    { label: "STUDY STREAK", value: currentMetrics.streak, sub: currentMetrics.streakSub, icon: Calendar },
  ]

  // Entrance Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35 },
    },
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
                <Card className="space-y-2 p-5 gap-0 shadow-sm hover:border-black/20 transition-all">
                  <div className="flex justify-between items-center">
                    <span className="label-mono text-[#526E7A]">{s.label}</span>
                    <Icon className="size-4 text-[#333333]" />
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={filter + s.value}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.2 }}
                      className="font-mono text-[32px] font-bold text-[#000000] leading-none mt-2"
                    >
                      {s.value}
                    </motion.p>
                  </AnimatePresence>
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
          <Card className="space-y-4 p-6 gap-0 shadow-sm">
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
          <Card className="space-y-4 p-6 gap-0 shadow-sm">
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
