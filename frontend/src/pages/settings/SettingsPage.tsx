import { useState, useEffect } from "react"
import { Bell, Shield, User } from "lucide-react"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

import { PageHeader } from "@/components/common/PageHeader"
import { useProfile } from "@/hooks/useProfile"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function SettingsPage() {
  const { profile, updateProfile, isLoading } = useProfile()

  const [activeSection, setActiveSection] = useState<"account" | "notifications" | "privacy">("account")

  const [fullName, setFullName] = useState(profile.name || "")
  const [nickname, setNickname] = useState(profile.nickname || "")
  const [primaryGoal, setPrimaryGoal] = useState(profile.primaryGoal || "")
  const [weeklyHours, setWeeklyHours] = useState(profile.weeklyHours || 10)

  useEffect(() => {
    setFullName(profile.name || "")
    setNickname(profile.nickname || "")
    setPrimaryGoal(profile.primaryGoal || "")
    setWeeklyHours(profile.weeklyHours || 10)
  }, [profile])

  const handleSave = async () => {
    try {
      await updateProfile({
        name: fullName,
        nickname: nickname,
        primaryGoal: primaryGoal,
        weeklyHours: Number(weeklyHours),
      })
      toast.success("Settings saved successfully!")
    } catch {
      toast.error("Failed to save settings.")
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8 pb-12 max-w-5xl mx-auto px-4 sm:px-6 py-8 min-h-[calc(100vh-64px)]"
    >
      <PageHeader
        label="SYSTEM PREFERENCES"
        title="Settings"
        description="Manage your account parameters, notification preferences, and data privacy."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Left Nav Tabs */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <div className="bg-white rounded-[4px] p-1.5 flex flex-row lg:flex-col gap-1 border border-black/[0.08] shadow-sm overflow-x-auto scrollbar-thin">
            {[
              { id: "account", label: "Account", icon: User },
              { id: "notifications", label: "Notifications", icon: Bell },
              { id: "privacy", label: "Privacy & Data", icon: Shield },
            ].map((tab) => {
              const Icon = tab.icon
              const isActive = activeSection === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id as any)}
                  className={`relative flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold rounded-[3px] transition-colors min-h-[44px] cursor-pointer text-left whitespace-nowrap ${
                    isActive ? "text-white font-bold" : "text-[#526E7A] hover:text-black hover:bg-black/[0.04]"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="settings-active-tab"
                      className="absolute inset-0 bg-black rounded-[3px]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon className="size-4 relative z-10 shrink-0" />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Right Settings Content */}
        <motion.div variants={itemVariants} className="lg:col-span-3 space-y-6">
          <AnimatePresence mode="wait">
            {activeSection === "account" && (
              <motion.div
                key="account"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="space-y-5 p-6 gap-0">
                  <h2 className="label-mono text-[#000000] font-bold text-xs">ACCOUNT DETAILS</h2>
                  <div className="space-y-4 mt-3">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label htmlFor="settings-fullname" className="label-mono text-[#000000] font-semibold text-xs block">
                        Full Name
                      </label>
                      <Input
                        id="settings-fullname"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Harsha Deva"
                        className="h-11"
                      />
                    </div>

                    {/* Preferred Nickname (Bug 3 Fix) */}
                    <div className="space-y-1.5">
                      <label htmlFor="settings-nickname" className="label-mono text-[#000000] font-semibold text-xs block">
                        Preferred Nickname
                      </label>
                      <Input
                        id="settings-nickname"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="e.g. Harsha (Add a preferred nickname)"
                        className="h-11"
                      />
                      <p className="text-[11px] text-[#526E7A]">Used by EV AI for personal greetings and dashboard displays.</p>
                    </div>

                    {/* Primary Target Goal */}
                    <div className="space-y-1.5">
                      <label htmlFor="settings-goal" className="label-mono text-[#000000] font-semibold text-xs block">
                        Primary Target Goal
                      </label>
                      <Input
                        id="settings-goal"
                        value={primaryGoal}
                        onChange={(e) => setPrimaryGoal(e.target.value)}
                        placeholder="e.g. Become Full Stack Developer"
                        className="h-11"
                      />
                    </div>

                    {/* Weekly Commitment */}
                    <div className="space-y-1.5">
                      <label htmlFor="settings-hours" className="label-mono text-[#000000] font-semibold text-xs block">
                        Weekly Commitment (Hours)
                      </label>
                      <Input
                        id="settings-hours"
                        type="number"
                        min="2"
                        max="60"
                        value={weeklyHours}
                        onChange={(e) => setWeeklyHours(Number(e.target.value))}
                        className="h-11"
                      />
                    </div>

                    <Button onClick={handleSave} disabled={isLoading} size="lg" className="mt-4 w-full sm:w-auto min-h-[44px]">
                      {isLoading ? "Saving..." : "Save Account Changes"}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}

            {activeSection === "notifications" && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="space-y-5 p-6 gap-0">
                  <h2 className="label-mono text-[#000000] font-bold text-xs">NOTIFICATION ALERTS</h2>
                  <div className="space-y-4 mt-3">
                    <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
                      <div>
                        <p className="text-sm font-semibold text-[#000000]">Email Weekly Digest</p>
                        <p className="text-xs text-[#526E7A]">Weekly summary of milestone progress and AI velocity</p>
                      </div>
                      <input type="checkbox" defaultChecked className="size-5 accent-[#000000] rounded cursor-pointer" />
                    </div>

                    <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
                      <div>
                        <p className="text-sm font-semibold text-[#000000]">GitHub Activity Sync Alerts</p>
                        <p className="text-xs text-[#526E7A]">Notify when new commits or repository stars are indexed</p>
                      </div>
                      <input type="checkbox" defaultChecked className="size-5 accent-[#000000] rounded cursor-pointer" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {activeSection === "privacy" && (
              <motion.div
                key="privacy"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="space-y-4 p-6 gap-0">
                  <h2 className="label-mono text-[#000000] font-bold text-xs">PRIVACY & DATA SECURITY</h2>
                  <p className="text-sm text-[#333333] leading-relaxed mt-2">
                    Your profile data is encrypted end-to-end and used exclusively to generate personalized career trajectory recommendations.
                  </p>
                  <Button variant="outline" size="sm" onClick={() => toast.info("Data export initiated")} className="mt-2 min-h-[44px]">
                    Export My Account Data
                  </Button>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  )
}
