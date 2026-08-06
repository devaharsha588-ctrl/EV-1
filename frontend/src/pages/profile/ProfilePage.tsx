import { MapPin, Mail, Globe, Link2, Edit3, Share2, Award } from "lucide-react"
import { motion } from "framer-motion"

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
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
      className="mx-auto max-w-4xl space-y-6 pb-12 px-4 sm:px-6 py-8 min-h-[calc(100vh-64px)]"
    >
      {/* Profile Header Card with Perfect Alignment */}
      <motion.div variants={itemVariants}>
        <Card className="p-0 border border-black/[0.08] bg-white shadow-sm gap-0 overflow-hidden">
          {/* Top Schematic Pattern Banner */}
          <div className="bg-black h-24 w-full border-b border-black/[0.08] relative overflow-hidden flex items-center justify-between px-6">
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
            <span className="font-mono text-[10px] text-white/70 tracking-[0.2em] relative z-10 uppercase font-bold">
              EV AI SYSTEM // USER PROFILE
            </span>
          </div>

          {/* Profile Details Container */}
          <div className="px-6 pb-6 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Avatar & User Details */}
              <div className="flex items-center gap-4">
                <Avatar size="lg" className="size-16 ring-2 ring-black/10 border border-black/10 shadow-sm rounded-[6px] shrink-0">
                  {profile.avatarUrl && <AvatarImage src={profile.avatarUrl} alt={displayName} />}
                  <AvatarFallback className="bg-black text-lg font-mono font-bold text-white rounded-[6px]">{userInitials}</AvatarFallback>
                </Avatar>

                <div className="space-y-1">
                  <h1 className="text-2xl font-semibold text-[#000000] tracking-tight leading-none">{displayName}</h1>
                  <p className="label-mono text-[#3B82F6] font-bold text-xs">
                    {(profile.primaryGoal || "Software Developer").toUpperCase()} • {(profile.userType || "Developer").toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-start sm:self-center">
                <Button variant="outline" size="sm" asChild className="h-9">
                  <a href="/settings">
                    <Edit3 className="mr-1.5 size-3.5" /> Edit Profile
                  </a>
                </Button>
                <Button variant="ghost" size="icon-sm" className="h-9 w-9" onClick={() => navigator.clipboard?.writeText(window.location.href)}>
                  <Share2 className="size-4 text-[#333333]" />
                </Button>
              </div>
            </div>

            {/* Sub-meta metrics bar */}
            <div className="mt-6 pt-4 border-t border-black/[0.06] grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs text-[#333333]">
              <div className="flex items-center gap-2 bg-[#F5F5F5] p-2.5 rounded-[4px] border border-black/[0.05]">
                <MapPin className="size-3.5 text-[#3B82F6] shrink-0" />
                <span className="truncate">Goal: <strong className="text-black">{profile.primaryGoal || "Career Evolution"}</strong></span>
              </div>

              <div className="flex items-center gap-2 bg-[#F5F5F5] p-2.5 rounded-[4px] border border-black/[0.05]">
                <Mail className="size-3.5 text-[#10B981] shrink-0" />
                <span className="truncate">Commitment: <strong className="text-black">{profile.weeklyHours}h / week</strong></span>
              </div>

              <div className="flex items-center gap-2 bg-[#F5F5F5] p-2.5 rounded-[4px] border border-black/[0.05]">
                <Award className="size-3.5 text-[#3B82F6] shrink-0" />
                <span className="truncate">CAREER HEALTH: <strong className="text-black">{dashboardData.careerScore}/100</strong></span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Grid Content Layout */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Left Column: Bio & Tech Stack */}
        <div className="space-y-6 md:col-span-1">
          <motion.div variants={itemVariants}>
            <Card className="p-5 space-y-3 gap-0">
              <h2 className="label-mono text-[#000000] font-bold text-xs">ABOUT & INTERESTS</h2>
              <p className="text-xs text-[#333333] leading-relaxed mt-2">
                Focusing on <strong className="text-black">{profile.interests.join(", ") || "Software Engineering"}</strong>. Learning style: <strong className="text-black">{profile.learningStyle || "Hands-on Projects"}</strong>.
              </p>
              <div className="flex gap-3 pt-2 text-[#333333]">
                {profile.portfolioUrl && (
                  <a href={profile.portfolioUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-[#3B82F6] hover:underline font-mono">
                    <Globe className="size-3.5" /> Portfolio
                  </a>
                )}
                {profile.githubUrl && (
                  <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-[#3B82F6] hover:underline font-mono">
                    <Link2 className="size-3.5" /> GitHub
                  </a>
                )}
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="p-5 space-y-3 gap-0">
              <h2 className="label-mono text-[#000000] font-bold text-xs">INDEXED TECHNOLOGIES</h2>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {(profile.knownTechnologies.length > 0 ? profile.knownTechnologies : ["JavaScript", "Git", "React"]).map((tech) => (
                  <span key={tech} className="rounded-[3px] border border-black/[0.09] bg-[#F5F5F5] px-2.5 py-1 font-mono text-xs font-semibold text-[#000000]">
                    {tech}
                  </span>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Right Column: AI Profile Snapshot & Active Trajectory */}
        <div className="space-y-6 md:col-span-2">
          {/* AI Profile Snapshot */}
          <motion.div variants={itemVariants}>
            <Card aiActive={true} className="p-5 space-y-3 gap-0">
              <span className="label-mono text-[#3B82F6] block font-bold text-xs">AI PROFILE SNAPSHOT</span>
              <div className="space-y-2 font-mono text-xs text-[#000000] pt-1">
                <div className="flex items-center justify-between border-b border-black/[0.05] pb-2">
                  <span className="text-[#526E7A]">PRIMARY GOAL:</span>
                  <strong className="text-[#10B981] font-bold">{profile.primaryGoal || "Career Growth"}</strong>
                </div>
                <div className="flex items-center justify-between border-b border-black/[0.05] pb-2">
                  <span className="text-[#526E7A]">ATS MATCH SCORE:</span>
                  <strong className="text-[#3B82F6] font-bold">{dashboardData.resumeScore}/100</strong>
                </div>
                <div className="flex items-center justify-between pt-0.5">
                  <span className="text-[#526E7A]">WEEKLY COMMITMENT:</span>
                  <strong className="text-black font-bold">{profile.weeklyHours} HOURS / WEEK</strong>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Active Trajectory Timeline */}
          <motion.div variants={itemVariants}>
            <Card className="p-5 space-y-3 gap-0">
              <h2 className="label-mono text-[#000000] font-bold text-xs">ACTIVE TRAJECTORY</h2>
              <div className="space-y-3 border-l-2 border-black/10 pl-4 mt-3">
                <div className="relative space-y-1">
                  <div className="bg-black absolute -left-[1.35rem] top-1 size-2 rounded-full" />
                  <p className="text-sm font-semibold text-[#000000]">{profile.userType || "Developer"} @ EV System</p>
                  <p className="font-mono text-xs text-[#526E7A] font-bold">ACTIVE // 2026</p>
                  <p className="text-xs text-[#333333] pt-1 leading-relaxed">
                    Executing milestone roadmap targeted toward <strong className="text-black">{profile.primaryGoal || "career evolution"}</strong>.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}
