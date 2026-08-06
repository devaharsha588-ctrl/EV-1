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
      {/* Profile Header Card */}
      <motion.div variants={itemVariants}>
        <Card className="p-0 overflow-hidden border border-black/[0.08] bg-white shadow-sm gap-0">
          {/* Schematic Pattern Banner */}
          <div className="bg-[#000000] h-28 w-full border-b border-black/[0.08] relative overflow-hidden flex items-center justify-between px-6">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
            <span className="font-mono text-[10px] text-white/60 tracking-[0.2em] relative z-10 uppercase font-bold">
              EV AI SYSTEM // USER PROFILE
            </span>
          </div>

          {/* Profile Details Bar */}
          <div className="relative px-6 pb-6 pt-0">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              {/* Avatar & Name */}
              <div className="-mt-10 flex items-end gap-4">
                <Avatar size="lg" className="size-20 ring-4 ring-white border border-black/10 shadow-md rounded-[6px]">
                  {profile.avatarUrl && <AvatarImage src={profile.avatarUrl} alt={displayName} />}
                  <AvatarFallback className="bg-black text-xl font-mono font-bold text-white rounded-[6px]">{userInitials}</AvatarFallback>
                </Avatar>
                <div className="pb-1">
                  {/* High Contrast Headings */}
                  <h1 className="text-2xl font-semibold text-[#000000] tracking-tight">{displayName}</h1>
                  <p className="font-mono text-xs text-[#3B82F6] font-bold mt-0.5">
                    {(profile.primaryGoal || "Software Developer").toUpperCase()} • {(profile.userType || "Developer").toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href="/settings">
                    <Edit3 className="mr-1.5 size-3.5" /> Edit Profile
                  </a>
                </Button>
                <Button variant="ghost" size="icon-sm" onClick={() => navigator.clipboard?.writeText(window.location.href)}>
                  <Share2 className="size-4 text-[#333333]" />
                </Button>
              </div>
            </div>

            {/* Sub-meta details */}
            <div className="mt-5 flex flex-wrap items-center gap-4 font-mono text-xs text-[#333333] pt-2 border-t border-black/[0.06]">
              <span className="flex items-center gap-1.5">
                <MapPin className="size-3.5 text-[#3B82F6]" /> Goal: <strong className="text-black">{profile.primaryGoal || "Career Evolution"}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="size-3.5 text-[#10B981]" /> Commitment: <strong className="text-black">{profile.weeklyHours}h / week</strong>
              </span>
              <span className="flex items-center gap-1.5 text-black font-bold">
                <Award className="size-3.5 text-[#3B82F6]" /> CAREER HEALTH: {dashboardData.careerScore}/100
              </span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Grid Content */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Left Column: Bio & Socials */}
        <div className="space-y-6 md:col-span-1">
          <motion.div variants={itemVariants}>
            <Card className="space-y-3 p-5 gap-0">
              <h2 className="label-mono text-[#000000] font-bold text-xs">ABOUT & INTERESTS</h2>
              <p className="text-sm text-[#333333] leading-relaxed mt-2">
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
            <Card className="space-y-3 p-5 gap-0">
              <h2 className="label-mono text-[#000000] font-bold text-xs">INDEXED TECHNOLOGIES</h2>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {(profile.knownTechnologies.length > 0 ? profile.knownTechnologies : ["JavaScript", "Git", "React"]).map((tech) => (
                  <span key={tech} className="rounded-[3px] border border-black/[0.09] bg-[#F5F5F5] px-3 py-1 font-mono text-xs font-semibold text-[#000000]">
                    {tech}
                  </span>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Right Column: AI Career Snapshot & Experience */}
        <div className="space-y-6 md:col-span-2">
          {/* AI Snapshot */}
          <motion.div variants={itemVariants}>
            <Card aiActive={true} className="p-5 space-y-2 gap-0">
              <span className="label-mono text-[#3B82F6] block mb-2 font-bold">AI PROFILE SNAPSHOT</span>
              <div className="space-y-2 font-mono text-xs text-[#000000]">
                <p className="flex justify-between border-b border-black/[0.05] pb-1.5">
                  <span className="text-[#526E7A]">PRIMARY GOAL:</span>
                  <strong className="text-[#10B981] font-bold">{profile.primaryGoal || "Career Growth"}</strong>
                </p>
                <p className="flex justify-between border-b border-black/[0.05] pb-1.5">
                  <span className="text-[#526E7A]">ATS MATCH SCORE:</span>
                  <strong className="text-[#3B82F6] font-bold">{dashboardData.resumeScore}/100</strong>
                </p>
                <p className="flex justify-between">
                  <span className="text-[#526E7A]">WEEKLY COMMITMENT:</span>
                  <strong className="text-black font-bold">{profile.weeklyHours} HOURS / WEEK</strong>
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Timeline Experience */}
          <motion.div variants={itemVariants}>
            <Card className="space-y-3 p-5 gap-0">
              <h2 className="label-mono text-[#000000] font-bold text-xs">ACTIVE TRAJECTORY</h2>
              <div className="space-y-3 border-l-2 border-black/10 pl-4 mt-3">
                <div className="relative space-y-1">
                  <div className="bg-[#000000] absolute -left-[1.35rem] top-1 size-2 rounded-full" />
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
