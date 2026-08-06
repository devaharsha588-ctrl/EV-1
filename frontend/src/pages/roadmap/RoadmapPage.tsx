import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Circle, ChevronDown, Lock } from "lucide-react"

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
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      <PageHeader
        title="Career Roadmap"
        description={`Your milestone progression generated for ${targetGoal}.`}
      />

      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="space-y-2 p-5">
          <span className="text-xs text-[#A7B0C0] font-semibold">OVERALL ROADMAP PROGRESS</span>
          <p className="font-mono text-3xl font-extrabold text-[#5B7CFA]">{roadmapData.overallProgress}%</p>
          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className="bg-[#5B7CFA] h-full rounded-full transition-all duration-300"
              style={{ width: `${roadmapData.overallProgress}%` }}
            />
          </div>
        </Card>

        <Card className="space-y-2 p-5">
          <span className="text-xs text-[#A7B0C0] font-semibold">ACTIVE PHASE</span>
          <p className="text-base font-semibold text-[#F5F7FA] truncate">{roadmapData.currentPhaseTitle}</p>
          <span className="font-mono text-xs text-[#32D296]">
            {roadmapData.finishedMilestonesCount} OF {roadmapData.totalMilestonesCount} MILESTONES FINISHED
          </span>
        </Card>

        <Card className="p-5">
          <span className="font-mono text-xs text-[#5B7CFA] uppercase block mb-1">AI Recommendation</span>
          <p className="text-xs font-medium text-[#F5F7FA] leading-relaxed">
            {roadmapData.aiRecommendation}
          </p>
        </Card>
      </div>

      {/* Timeline List */}
      <div className="space-y-4">
        {roadmapData.phases.map((phase) => {
          const isExpanded = expandedPhase === phase.id
          return (
            <Card
              key={phase.id}
              className={`p-0 overflow-hidden transition-all ${
                phase.status === "current" ? "border-[#5B7CFA]/40 bg-[#1C2230]" : ""
              }`}
            >
              {/* Phase Header Bar */}
              <button
                onClick={() => togglePhase(phase.id)}
                className="flex w-full items-center justify-between p-5 text-left"
              >
                <div className="flex items-center gap-4">
                  {phase.status === "completed" ? (
                    <CheckCircle2 className="size-5 text-[#32D296] shrink-0" />
                  ) : phase.status === "current" ? (
                    <div className="size-3 rounded-full bg-[#5B7CFA] animate-pulse shrink-0" />
                  ) : (
                    <Lock className="size-4 text-[#A7B0C0]/40 shrink-0" />
                  )}
                  <div>
                    <h2 className="text-base font-semibold text-[#F5F7FA]">{phase.title}</h2>
                    <p className="font-mono text-xs text-[#A7B0C0]">
                      {phase.milestones.length} MILESTONES • {phase.progress}% COMPLETED
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-0.5 font-mono text-[0.7rem] font-semibold ${
                      phase.status === "completed"
                        ? "bg-[#32D296]/10 text-[#32D296]"
                        : phase.status === "current"
                        ? "bg-[#5B7CFA]/15 text-[#5B7CFA]"
                        : "bg-white/5 text-[#A7B0C0]"
                    }`}
                  >
                    {phase.status === "completed"
                      ? "COMPLETED"
                      : phase.status === "current"
                      ? "IN PROGRESS"
                      : "LOCKED"}
                  </span>
                  <ChevronDown
                    className={`size-4 text-[#A7B0C0] transition-transform ${
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
                    className="border-t border-white/5 px-5 pb-5 pt-3 space-y-2.5"
                  >
                    {phase.milestones.map((m) => (
                      <div
                        key={m.id}
                        className={`flex items-start justify-between rounded-xl p-3.5 border transition-all ${
                          m.status === "current"
                            ? "border-[#5B7CFA]/30 bg-[#151922]"
                            : "bg-[#151922] border-white/5"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {m.status === "completed" ? (
                            <CheckCircle2 className="size-4 text-[#32D296] shrink-0 mt-0.5" />
                          ) : m.status === "current" ? (
                            <div className="size-2.5 rounded-full bg-[#5B7CFA] shrink-0 mt-1.5" />
                          ) : (
                            <Circle className="size-4 text-[#A7B0C0]/40 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <p className="text-sm font-medium text-[#F5F7FA]">{m.title}</p>
                            <p className="text-xs text-[#A7B0C0] mt-0.5">{m.desc}</p>
                          </div>
                        </div>

                        <span className="font-mono text-xs text-[#A7B0C0] shrink-0 ml-4">
                          {m.estimatedTime}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
