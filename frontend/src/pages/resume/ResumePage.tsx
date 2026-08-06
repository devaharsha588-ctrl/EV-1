import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Download, Plus } from "lucide-react"
import { toast } from "sonner"

import { PageHeader } from "@/components/common/PageHeader"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useProfile } from "@/hooks/useProfile"

export default function ResumePage() {
  const { resumeData, profile } = useProfile()
  const [activeTab, setActiveTab] = useState<"summary" | "experience" | "skills">("summary")
  const [summaryText, setSummaryText] = useState(resumeData.summary)

  const displayName = profile.nickname || profile.name || "Learner"
  const targetGoal = profile.primaryGoal || "Software Engineer"

  // Stagger Animation Variants
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

  const rightPanelVariants = {
    hidden: { opacity: 0, x: 16 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8 pb-12 max-w-5xl mx-auto px-4 sm:px-6 py-8 min-h-[calc(100vh-64px)]"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants}>
        <PageHeader
          label="AI RESUME BUILDER"
          title="Resume Builder"
          description={`Optimize your resume for ${targetGoal} roles.`}
          actions={
            <Button
              onClick={() => toast.info("PDF Export feature coming soon")}
              size="sm"
              className="shadow-sm active:scale-95 transition-transform"
            >
              <Download className="mr-2 size-3.5" /> Export PDF
            </Button>
          }
        />
      </motion.div>

      {/* Main Two-Panel Workspace */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Left 3 Cols: Editor Workspace */}
        <motion.div variants={itemVariants} className="space-y-5 lg:col-span-3">
          {/* Tab Bar with Animated Liquid Pill */}
          <div className="bg-white border border-black/[0.08] rounded-[4px] p-1 flex gap-1 shadow-sm relative">
            {(["summary", "experience", "skills"] as const).map((tab) => {
              const isActive = activeTab === tab
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-1.5 label-mono rounded-[3px] capitalize transition-colors relative z-10 cursor-pointer ${
                    isActive ? "text-white font-bold" : "text-[#526E7A] hover:text-black"
                  }`}
                >
                  {tab.toUpperCase()}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabPill"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className="absolute inset-0 bg-black rounded-[3px] -z-10"
                    />
                  )}
                </button>
              )
            })}
          </div>

          {/* Tab Content Card */}
          <Card className="space-y-4 p-6 gap-0 shadow-sm">
            <AnimatePresence mode="wait">
              {activeTab === "summary" && (
                <motion.div
                  key="summary"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <label className="label-mono">PROFESSIONAL SUMMARY</label>
                    <span className="label-mono text-[#526E7A]">{summaryText.length} CHARS</span>
                  </div>
                  <textarea
                    value={summaryText}
                    onChange={(e) => setSummaryText(e.target.value)}
                    rows={6}
                    className="input-clean w-full p-4 text-sm leading-relaxed resize-none focus:ring-1 focus:ring-black"
                  />
                  <div className="rounded-[4px] border border-[#3B82F6]/20 bg-[#3B82F6]/[0.04] p-4">
                    <span className="label-mono text-[#3B82F6] block mb-1">AI IMPACT ENHANCEMENT</span>
                    <p className="text-[13px] font-medium text-[#000000]">
                      "{resumeData.aiSuggestions[0] || "Incorporate quantified metrics to increase ATS match strength."}"
                    </p>
                  </div>
                </motion.div>
              )}

              {activeTab === "experience" && (
                <motion.div
                  key="experience"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3"
                >
                  {resumeData.experiences.map((exp, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.06 }}
                      className="rounded-[4px] border border-black/[0.07] bg-[#F5F5F5] p-4 space-y-1.5"
                    >
                      <div>
                        <p className="text-sm font-semibold text-[#000000]">{exp.title}</p>
                        <p className="font-mono text-[10px] text-[#526E7A] tracking-wider mt-0.5">{exp.company} · {exp.dates}</p>
                      </div>
                      <p className="text-xs text-[#526E7A] leading-relaxed">{exp.description}</p>
                    </motion.div>
                  ))}
                  <Button variant="outline" className="w-full border-dashed hover:bg-[#F8F8F8]">
                    <Plus className="mr-2 size-3.5" /> Add Experience
                  </Button>
                </motion.div>
              )}

              {activeTab === "skills" && (
                <motion.div
                  key="skills"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3"
                >
                  <label className="label-mono">INDEXED SKILLS FOR {targetGoal.toUpperCase()}</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {resumeData.skills.map((s, sIndex) => (
                      <motion.span
                        key={s}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: sIndex * 0.04 }}
                        className="rounded-[3px] border border-black/[0.08] bg-[#F5F5F5] px-3 py-1.5 label-mono text-[#000000]"
                      >
                        ✓ {s}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>

        {/* Right 2 Cols: ATS Score & Live Preview */}
        <motion.div variants={rightPanelVariants} className="space-y-5 lg:col-span-2">
          {/* ATS Score */}
          <Card className="p-6 gap-0 shadow-sm" aiActive>
            <div className="flex justify-between items-center mb-3">
              <span className="label-mono text-[#3B82F6]">ATS MATCH SCORE</span>
              <span className="label-mono text-[#10B981]">{resumeData.matchStatus}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-[48px] font-bold text-[#000000] leading-none">{resumeData.atsScore}</span>
              <span className="font-mono text-base text-[#526E7A]">/ 100</span>
            </div>
            <div className="w-full bg-black/[0.06] h-1.5 rounded-full overflow-hidden mt-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${resumeData.atsScore}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-black h-full rounded-full"
              />
            </div>
            <p className="text-xs text-[#526E7A] mt-3 leading-relaxed">
              Your resume aligns with {resumeData.atsScore}% of target postings for {targetGoal}.
            </p>
          </Card>

          {/* Live Preview */}
          <Card className="p-6 gap-0 shadow-sm">
            <div className="border-b border-black/[0.07] pb-3 mb-3">
              <h3 className="text-[15px] font-semibold text-[#000000]">{displayName}</h3>
              <p className="label-mono text-[#3B82F6] mt-1">{targetGoal} · {profile.userType || "Developer"}</p>
            </div>
            <div className="space-y-1.5">
              <p className="label-mono">SUMMARY</p>
              <p className="text-xs text-[#526E7A] line-clamp-4 leading-relaxed mt-1">{summaryText}</p>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
