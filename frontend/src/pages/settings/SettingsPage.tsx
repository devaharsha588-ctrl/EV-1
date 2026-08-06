import { useState, useEffect } from "react"
import { Sun, Moon, Bell, Shield, User, Sliders } from "lucide-react"
import { toast } from "sonner"

import { PageHeader } from "@/components/common/PageHeader"
import { useTheme } from "@/hooks/useTheme"
import { useSidebar } from "@/hooks/useSidebar"
import { useProfile } from "@/hooks/useProfile"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { isCollapsed, toggleSidebar } = useSidebar()
  const { profile, updateProfile } = useProfile()

  const [activeSection, setActiveSection] = useState<"account" | "appearance" | "notifications" | "privacy">("account")

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
    await updateProfile({
      name: fullName,
      nickname: nickname,
      primaryGoal: primaryGoal,
      weeklyHours: Number(weeklyHours),
    })
    toast.success("Settings updated successfully!")
  }

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      <PageHeader title="Settings" description="Manage your profile parameters, AI alerts, and system preferences." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Left Nav */}
        <div className="lg:col-span-1">
          <div className="bg-[#151922] rounded-2xl p-1.5 flex flex-row lg:flex-col gap-1 border border-white/5">
            {[
              { id: "account", label: "Account", icon: User },
              { id: "appearance", label: "Appearance", icon: Sliders },
              { id: "notifications", label: "Notifications", icon: Bell },
              { id: "privacy", label: "Privacy & Data", icon: Shield },
            ].map((tab) => {
              const Icon = tab.icon
              const isActive = activeSection === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id as any)}
                  className={`flex flex-1 items-center gap-2.5 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all ${
                    isActive
                      ? "bg-[#5B7CFA] text-white font-semibold"
                      : "text-[#A7B0C0] hover:text-[#F5F7FA]"
                  }`}
                >
                  <Icon className="size-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right Settings Content */}
        <div className="lg:col-span-3 space-y-6">
          {activeSection === "account" && (
            <Card className="space-y-5 p-6">
              <h2 className="font-mono text-xs font-semibold text-[#F5F7FA]">ACCOUNT DETAILS</h2>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="settings-fullname" className="text-xs font-semibold text-[#F5F7FA]">Full Name</label>
                  <Input id="settings-fullname" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="settings-nickname" className="text-xs font-semibold text-[#F5F7FA]">Preferred Nickname</label>
                  <Input id="settings-nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="settings-goal" className="text-xs font-semibold text-[#F5F7FA]">Primary Target Goal</label>
                  <Input id="settings-goal" value={primaryGoal} onChange={(e) => setPrimaryGoal(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="settings-hours" className="text-xs font-semibold text-[#F5F7FA]">Weekly Commitment (Hours)</label>
                  <Input
                    id="settings-hours"
                    type="number"
                    min="2"
                    max="40"
                    value={weeklyHours}
                    onChange={(e) => setWeeklyHours(Number(e.target.value))}
                  />
                </div>
                <Button onClick={handleSave} size="sm" className="mt-2">
                  Save Account Changes
                </Button>
              </div>
            </Card>
          )}

          {activeSection === "appearance" && (
            <Card className="space-y-5 p-6">
              <h2 className="font-mono text-xs font-semibold text-[#F5F7FA]">THEME & INTERFACE MODE</h2>
              <div className="space-y-4">
                <span className="text-xs font-semibold text-[#F5F7FA] block">Theme Preference</span>
                <div className="grid grid-cols-2 gap-3 max-w-xs">
                  {[
                    { id: "light", label: "Light Mode", icon: Sun },
                    { id: "dark", label: "Dark Mode (Default)", icon: Moon },
                  ].map((t) => {
                    const Icon = t.icon
                    const isSelected = theme === t.id
                    return (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id as "light" | "dark")}
                        className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                          isSelected
                            ? "border-[#5B7CFA] bg-[#5B7CFA]/15 font-semibold text-white"
                            : "border-white/5 bg-[#1C2230] text-[#A7B0C0]"
                        }`}
                      >
                        <Icon className="size-5" />
                        <span className="text-xs">{t.label}</span>
                      </button>
                    )
                  })}
                </div>

                <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-[#F5F7FA]">Sidebar Collapsed State</p>
                    <p className="text-xs text-[#A7B0C0]">Keep sidebar minified for maximum workspace</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={toggleSidebar}>
                    {isCollapsed ? "Collapsed" : "Expanded"}
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {activeSection === "notifications" && (
            <Card className="space-y-5 p-6">
              <h2 className="font-mono text-xs font-semibold text-[#F5F7FA]">NOTIFICATION ALERTS</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div>
                    <p className="text-xs font-semibold text-[#F5F7FA]">Email Digest</p>
                    <p className="text-xs text-[#A7B0C0]">Weekly summary of milestone progress</p>
                  </div>
                  <input type="checkbox" defaultChecked className="size-4 accent-[#5B7CFA]" />
                </div>
              </div>
            </Card>
          )}

          {activeSection === "privacy" && (
            <Card className="space-y-4 p-6">
              <h2 className="font-mono text-xs font-semibold text-[#F5F7FA]">PRIVACY & DATA SECURITY</h2>
              <p className="text-xs text-[#A7B0C0] leading-relaxed">
                Your data is encrypted end-to-end and used exclusively to generate custom career trajectory recommendations.
              </p>
              <Button variant="outline" size="sm" onClick={() => toast.info("Data export initiated")}>
                Export My Account Data
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
