import { useState } from "react"
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

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <PageHeader
        label="AI RESUME BUILDER"
        title="Resume Builder"
        description={`Optimize your resume for ${targetGoal} roles.`}
        actions={
          <Button
            onClick={() => toast.info("PDF Export feature coming soon")}
            size="sm"
          >
            <Download className="mr-2 size-3.5" /> Export PDF
          </Button>
        }
      />

      {/* Main Two-Panel Workspace */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Left 3 Cols: Editor */}
        <div className="space-y-5 lg:col-span-3">
          {/* Tab Bar */}
          <div className="bg-white border border-black/[0.08] rounded-[4px] p-1 flex gap-0.5">
            {(["summary", "experience", "skills"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1.5 label-mono rounded-[3px] capitalize transition-all ${
                  activeTab === tab
                    ? "bg-black text-white"
                    : "text-[#526E7A] hover:text-black"
                }`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <Card className="space-y-4 p-6 gap-0">
            {activeTab === "summary" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="label-mono">PROFESSIONAL SUMMARY</label>
                  <span className="label-mono text-[#526E7A]">{summaryText.length} CHARS</span>
                </div>
                <textarea
                  value={summaryText}
                  onChange={(e) => setSummaryText(e.target.value)}
                  rows={6}
                  className="input-clean w-full p-4 text-sm leading-relaxed resize-none"
                />
                <div className="rounded-[4px] border border-[#3B82F6]/20 bg-[#3B82F6]/[0.04] p-4">
                  <span className="label-mono text-[#3B82F6] block mb-1">AI IMPACT ENHANCEMENT</span>
                  <p className="text-[13px] font-medium text-[#000000]">
                    "{resumeData.aiSuggestions[0] || "Incorporate quantified metrics to increase ATS match strength."}"
                  </p>
                </div>
              </div>
            )}

            {activeTab === "experience" && (
              <div className="space-y-3">
                {resumeData.experiences.map((exp, idx) => (
                  <div key={idx} className="rounded-[4px] border border-black/[0.07] bg-[#F5F5F5] p-4 space-y-1.5">
                    <div>
                      <p className="text-sm font-semibold text-[#000000]">{exp.title}</p>
                      <p className="font-mono text-[10px] text-[#526E7A] tracking-wider mt-0.5">{exp.company} · {exp.dates}</p>
                    </div>
                    <p className="text-xs text-[#526E7A] leading-relaxed">{exp.description}</p>
                  </div>
                ))}
                <Button variant="outline" className="w-full border-dashed">
                  <Plus className="mr-2 size-3.5" /> Add Experience
                </Button>
              </div>
            )}

            {activeTab === "skills" && (
              <div className="space-y-3">
                <label className="label-mono">INDEXED SKILLS FOR {targetGoal.toUpperCase()}</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {resumeData.skills.map((s) => (
                    <span key={s} className="rounded-[3px] border border-black/[0.08] bg-[#F5F5F5] px-3 py-1.5 label-mono text-[#000000]">
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right 2 Cols: Score + Preview */}
        <div className="space-y-5 lg:col-span-2">
          {/* ATS Score */}
          <Card className="p-6 gap-0" aiActive>
            <div className="flex justify-between items-center mb-3">
              <span className="label-mono text-[#3B82F6]">ATS MATCH SCORE</span>
              <span className="label-mono text-[#10B981]">{resumeData.matchStatus}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-[48px] font-bold text-[#000000] leading-none">{resumeData.atsScore}</span>
              <span className="font-mono text-base text-[#526E7A]">/ 100</span>
            </div>
            <div className="w-full bg-black/[0.06] h-1 rounded-full overflow-hidden mt-4">
              <div
                className="bg-black h-full rounded-full transition-all duration-500"
                style={{ width: `${resumeData.atsScore}%` }}
              />
            </div>
            <p className="text-xs text-[#526E7A] mt-3">
              Your resume aligns with {resumeData.atsScore}% of target postings for {targetGoal}.
            </p>
          </Card>

          {/* Live Preview */}
          <Card className="p-6 gap-0">
            <div className="border-b border-black/[0.07] pb-3 mb-3">
              <h3 className="text-[15px] font-semibold text-[#000000]">{displayName}</h3>
              <p className="label-mono text-[#3B82F6] mt-1">{targetGoal} · {profile.userType || "Developer"}</p>
            </div>
            <div className="space-y-1.5">
              <p className="label-mono">SUMMARY</p>
              <p className="text-xs text-[#526E7A] line-clamp-4 leading-relaxed mt-1">{summaryText}</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
