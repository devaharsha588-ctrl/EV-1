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
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      <PageHeader
        title="AI Resume Builder"
        description={`Quantify your impact and optimize your resume for ${targetGoal} job listings.`}
        actions={
          <Button
            onClick={() => toast.info("PDF Export feature coming soon")}
            size="sm"
          >
            <Download className="mr-2 size-4" /> Export PDF
          </Button>
        }
      />

      {/* Main Two-Panel Workspace */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Left 3 Cols: Editor */}
        <div className="space-y-6 lg:col-span-3">
          {/* Navigation Tabs */}
          <div className="bg-[#151922] rounded-full p-1 flex gap-1 border border-white/5">
            {(["summary", "experience", "skills"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-full capitalize transition-all ${
                  activeTab === tab
                    ? "bg-[#5B7CFA] text-white"
                    : "text-[#A7B0C0] hover:text-[#F5F7FA]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <Card className="space-y-4 p-6">
            {activeTab === "summary" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="font-mono text-xs font-semibold text-[#A7B0C0]">
                    PROFESSIONAL SUMMARY
                  </label>
                  <span className="font-mono text-xs text-[#A7B0C0]">{summaryText.length} CHARS</span>
                </div>
                <textarea
                  value={summaryText}
                  onChange={(e) => setSummaryText(e.target.value)}
                  rows={6}
                  className="input-clean w-full p-4 text-sm leading-relaxed outline-none text-[#F5F7FA]"
                />

                <div className="rounded-xl border border-[#5B7CFA]/30 bg-[#1C2230] p-4 space-y-1.5">
                  <span className="font-mono text-xs font-semibold text-[#5B7CFA]">AI IMPACT ENHANCEMENT</span>
                  <p className="text-xs font-medium text-[#F5F7FA]">
                    "{resumeData.aiSuggestions[0] || "Incorporate quantified metrics to increase ATS match strength."}"
                  </p>
                </div>
              </div>
            )}

            {activeTab === "experience" && (
              <div className="space-y-4">
                {resumeData.experiences.map((exp, idx) => (
                  <div key={idx} className="rounded-xl border border-white/5 bg-[#1C2230] p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-semibold text-[#F5F7FA]">{exp.title}</p>
                        <p className="font-mono text-xs text-[#A7B0C0]">{exp.company} • {exp.dates}</p>
                      </div>
                    </div>
                    <p className="text-xs text-[#A7B0C0] leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                ))}

                <Button variant="outline" className="w-full border-dashed border-white/10">
                  <Plus className="mr-2 size-4" /> Add Experience Record
                </Button>
              </div>
            )}

            {activeTab === "skills" && (
              <div className="space-y-4">
                <label className="font-mono text-xs font-semibold text-[#A7B0C0]">
                  INDEXED SKILLS FOR {targetGoal.toUpperCase()}
                </label>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.map((s) => (
                    <span key={s} className="rounded-full border border-white/10 bg-[#1C2230] px-3.5 py-1 font-mono text-xs text-[#32D296]">
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right 2 Cols: Live Score & Preview */}
        <div className="space-y-6 lg:col-span-2">
          {/* AI Score Banner */}
          <Card aiActive={true} className="space-y-4 p-6">
            <div className="flex justify-between items-center">
              <span className="font-mono text-xs text-[#5B7CFA] uppercase font-semibold">ATS Match Score</span>
              <span className="font-mono text-xs text-[#32D296] uppercase font-semibold">{resumeData.matchStatus}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-4xl font-extrabold text-[#F5F7FA]">{resumeData.atsScore}</span>
              <span className="font-mono text-sm text-[#A7B0C0]">/ 100</span>
            </div>
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#5B7CFA] h-full rounded-full transition-all duration-300"
                style={{ width: `${resumeData.atsScore}%` }}
              />
            </div>
            <p className="text-xs text-[#A7B0C0]">
              Your resume aligns with {resumeData.atsScore}% of target postings for {targetGoal}.
            </p>
          </Card>

          {/* Live Preview Card */}
          <Card className="space-y-3 p-6">
            <div className="border-b border-white/5 pb-3">
              <h3 className="text-base font-semibold text-[#F5F7FA]">{displayName}</h3>
              <p className="font-mono text-xs text-[#5B7CFA]">{targetGoal} • {profile.userType || "Developer"}</p>
            </div>
            <div className="space-y-1.5 text-xs text-[#A7B0C0]">
              <p className="font-semibold text-[#F5F7FA]">Summary</p>
              <p className="line-clamp-3 leading-relaxed">{summaryText}</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
