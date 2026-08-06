import { MapPin, Mail, Globe, Link2, Edit3, Share2 } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useProfile } from "@/hooks/useProfile"

export default function ProfilePage() {
  const { profile, dashboardData } = useProfile()

  const displayName = profile.name || "Learner Profile"
  const userInitials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "EV"

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-12">
      {/* Profile Banner & Header */}
      <Card className="p-0 overflow-hidden">
        {/* Banner */}
        <div className="bg-[#1C2230] h-28 w-full border-b border-white/5" />

        {/* Profile Details Bar */}
        <div className="relative px-6 pb-6 pt-0">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            {/* Avatar overlapping banner */}
            <div className="-mt-10 flex items-end gap-4">
              <Avatar size="lg" className="size-20 ring-4 ring-[#0D0F14] border border-white/10 shadow-lg">
                {profile.avatarUrl && <AvatarImage src={profile.avatarUrl} alt={displayName} />}
                <AvatarFallback className="bg-[#5B7CFA] text-xl font-bold text-white">{userInitials}</AvatarFallback>
              </Avatar>
              <div className="pb-1">
                <h1 className="text-xl font-bold text-[#F5F7FA]">{displayName}</h1>
                <p className="font-mono text-xs text-[#5B7CFA]">
                  {(profile.primaryGoal || "Software Developer").toUpperCase()} • {(profile.userType || "Developer").toUpperCase()}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Edit3 className="mr-1.5 size-3.5" /> Edit Profile
              </Button>
              <Button variant="ghost" size="icon-sm">
                <Share2 className="size-4" />
              </Button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4 font-mono text-xs text-[#A7B0C0]">
            <span className="flex items-center gap-1">
              <MapPin className="size-3.5 text-[#5B7CFA]" /> Goal: {profile.primaryGoal || "Career Evolution"}
            </span>
            <span className="flex items-center gap-1">
              <Mail className="size-3.5 text-[#32D296]" /> {profile.weeklyHours}h / week commitment
            </span>
            <span className="text-[#5B7CFA] font-semibold">CAREER HEALTH: {dashboardData.careerScore}/100</span>
          </div>
        </div>
      </Card>

      {/* Grid Content */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Left Column: Bio & Socials */}
        <div className="space-y-6 md:col-span-1">
          <Card className="space-y-3 p-5">
            <h2 className="font-mono text-xs font-semibold text-[#F5F7FA]">ABOUT & INTERESTS</h2>
            <p className="text-xs text-[#A7B0C0] leading-relaxed">
              Interests in {profile.interests.join(", ") || "software engineering"}. Learning style: {profile.learningStyle || "Projects"}.
            </p>
            <div className="flex gap-3 pt-1 text-[#A7B0C0]">
              {profile.portfolioUrl && (
                <a href={profile.portfolioUrl} target="_blank" rel="noreferrer">
                  <Globe className="size-4 hover:text-[#F5F7FA] cursor-pointer transition-colors" />
                </a>
              )}
              {profile.githubUrl && (
                <a href={profile.githubUrl} target="_blank" rel="noreferrer">
                  <Link2 className="size-4 hover:text-[#F5F7FA] cursor-pointer transition-colors" />
                </a>
              )}
            </div>
          </Card>

          <Card className="space-y-3 p-5">
            <h2 className="font-mono text-xs font-semibold text-[#F5F7FA]">INDEXED TECHNOLOGIES</h2>
            <div className="flex flex-wrap gap-1.5">
              {(profile.knownTechnologies.length > 0 ? profile.knownTechnologies : ["JavaScript", "Git", "React"]).map((tech) => (
                <span key={tech} className="rounded-full border border-white/5 bg-[#1C2230] px-3 py-1 font-mono text-xs text-[#F5F7FA]">
                  {tech}
                </span>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: AI Career Snapshot & Experience */}
        <div className="space-y-6 md:col-span-2">
          {/* AI Snapshot */}
          <Card aiActive={true} className="p-5 space-y-2">
            <span className="font-mono text-xs font-semibold text-[#5B7CFA] uppercase block">AI Profile Snapshot</span>
            <div className="space-y-1.5 font-mono text-xs text-[#F5F7FA]">
              <p>• PRIMARY GOAL: <strong className="text-[#32D296]">{profile.primaryGoal || "Career Growth"}</strong></p>
              <p>• ATS MATCH SCORE: <strong className="text-[#7B61FF]">{dashboardData.resumeScore}/100</strong></p>
              <p>• WEEKLY COMMITMENT: <strong className="text-[#F5F7FA]">{profile.weeklyHours} HOURS / WEEK</strong></p>
            </div>
          </Card>

          {/* Timeline Experience */}
          <Card className="space-y-3 p-5">
            <h2 className="font-mono text-xs font-semibold text-[#F5F7FA]">ACTIVE TRAJECTORY</h2>
            <div className="space-y-3 border-l border-white/10 pl-4">
              <div className="relative space-y-1">
                <div className="bg-[#5B7CFA] absolute -left-[1.35rem] top-1 size-2 rounded-full" />
                <p className="text-sm font-semibold text-[#F5F7FA]">{profile.userType || "Developer"} @ EV System</p>
                <p className="font-mono text-xs text-[#A7B0C0]">ACTIVE // 2026</p>
                <p className="text-xs text-[#A7B0C0] pt-1 leading-relaxed">
                  Executing milestone roadmap targeted toward {profile.primaryGoal || "career evolution"}.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
