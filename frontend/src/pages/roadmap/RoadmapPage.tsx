import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle2, Circle, ChevronDown } from "lucide-react"

import { PageHeader } from "@/components/common/PageHeader"
import { Card } from "@/components/ui/card"
import { useProfile } from "@/hooks/useProfile"

export default function RoadmapPage() {
  const { roadmapData, profile } = useProfile()
  const [expandedPhase, setExpandedPhase] = useState<string | null>(
    roadmapData.phases[1]?.id || roadmapData.phases[0]?.id || "phase-1",
  )

  const togglePhase = (id: string) => {
    setExpandedPhase(expandedPhase === id ? null : id)
  }

  const targetGoal = profile.primaryGoal || "Software Developer"

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <PageHeader
        label="CAREER ROADMAP"
        title={targetGoal}
        description={`Your milestone progression — generated from your profile.`}
      />

      {/* Overview Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Overall Progress */}
        <Card className="space-y-3 p-5 gap-0">
          <span className="label-mono">OVERALL PROGRESS</span>
          <p className="font-mono text-[40px] font-bold text-[#000000] leading-none mt-2">
            {roadmapData.overallProgress}
            <span className="text-[20px] font-normal text-[#526E7A]">%</span>
          </p>
          <div className="w-full bg-black/[0.06] h-1 rounded-full overflow-hidden mt-3">
            <div
              className="bg-[#000000] h-full rounded-full transition-all duration-500"
              style={{ width: `${roadmapData.overallProgress}%` }}
            />
          </div>
        </Card>

        {/* Active Phase */}
        <Card className="space-y-2 p-5 gap-0">
          <span className="label-mono">ACTIVE PHASE</span>
          <p className="text-[15px] font-semibold text-[#000000] truncate mt-2 leading-snug">
            {roadmapData.currentPhaseTitle}
          </p>
          <span className="label-mono text-[#10B981]">
            {roadmapData.finishedMilestonesCount} / {roadmapData.totalMilestonesCount} MILESTONES
          </span>
        </Card>

        {/* AI Recommendation */}
        <Card className="p-5 gap-0" aiActive>
          <span className="label-mono text-[#3B82F6]">AI RECOMMENDATION</span>
          <p className="text-[13px] font-medium text-[#000000] leading-relaxed mt-2">
            {roadmapData.aiRecommendation}
          </p>
        </Card>
      </div>

      {/* Timeline */}
      <div className="space-y-3">
        {roadmapData.phases.map((phase, phaseIndex) => {
          const isExpanded = expandedPhase === phase.id
          return (
            <div key={phase.id} className="flex gap-4">
              {/* Timeline Track */}
              <div className="hidden sm:flex flex-col items-center pt-5">
                <div
                  className={`size-3 rounded-full shrink-0 border-2 ${
                    phase.status === "completed"
                      ? "bg-[#10B981] border-[#10B981]"
                      : phase.status === "current"
                      ? "bg-[#3B82F6] border-[#3B82F6]"
                      : "bg-white border-black/20"
                  }`}
                />
                {phaseIndex < roadmapData.phases.length - 1 && (
                  <div className="w-px flex-1 bg-black/[0.08] mt-1" />
                )}
              </div>

              {/* Phase Card */}
              <Card
                className={`flex-1 p-0 overflow-hidden transition-all ${
                  phase.status === "current" ? "border-l-[3px] border-l-[#3B82F6]" : ""
                }`}
              >
                {/* Phase Header */}
                <button
                  onClick={() => togglePhase(phase.id)}
                  className="flex w-full items-center justify-between p-5 text-left hover:bg-black/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <h2 className="text-[15px] font-semibold text-[#000000]">{phase.title}</h2>
                      <p className="label-mono text-[#526E7A] mt-1">
                        {phase.milestones.length} MILESTONES • {phase.progress}% COMPLETE
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-[3px] px-2.5 py-1 label-mono ${
                        phase.status === "completed"
                          ? "bg-[#10B981]/10 text-[#10B981]"
                          : phase.status === "current"
                          ? "bg-[#3B82F6]/10 text-[#3B82F6]"
                          : "bg-black/[0.04] text-[#526E7A]"
                      }`}
                    >
                      {phase.status === "completed"
                        ? "COMPLETED"
                        : phase.status === "current"
                        ? "IN PROGRESS"
                        : "UPCOMING"}
                    </span>
                    <ChevronDown
                      className={`size-4 text-[#526E7A] transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {/* Milestones Drawer */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="border-t border-black/[0.06] px-5 pb-5 pt-4 space-y-2"
                    >
                      {phase.milestones.map((m) => (
                        <div
                          key={m.id}
                          className={`flex items-start justify-between rounded-[4px] p-3.5 border transition-all ${
                            m.status === "current"
                              ? "border-[#3B82F6]/20 bg-[#3B82F6]/[0.03]"
                              : m.status === "completed"
                              ? "border-black/[0.05] bg-[#F5F5F5]"
                              : "border-black/[0.05] bg-white"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {m.status === "completed" ? (
                              <CheckCircle2 className="size-4 text-[#10B981] shrink-0 mt-0.5" />
                            ) : m.status === "current" ? (
                              <div className="size-2 rounded-full bg-[#3B82F6] shrink-0 mt-1.5 animate-pulse" />
                            ) : (
                              <Circle className="size-4 text-[#526E7A]/30 shrink-0 mt-0.5" />
                            )}
                            <div>
                              <p
                                className={`text-sm font-medium ${
                                  m.status === "completed" ? "line-through text-[#526E7A]" : "text-[#000000]"
                                }`}
                              >
                                {m.title}
                              </p>
                              <p className="text-xs text-[#526E7A] mt-0.5">{m.desc}</p>
                            </div>
                          </div>

                          <span className="label-mono text-[#526E7A] shrink-0 ml-4">
                            {m.estimatedTime}
                          </span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  )
}
