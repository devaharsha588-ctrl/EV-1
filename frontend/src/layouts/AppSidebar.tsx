import { memo } from "react"
import { NavLink } from "react-router-dom"
import { motion } from "framer-motion"
import {
  ChevronLeft,
  ChevronRight,
  Home,
  GitBranch,
  FileText,
  BarChart3,
  User,
  Settings,
} from "lucide-react"

import { PROTECTED_ROUTES } from "@/constants/routes"
import { useSidebar } from "@/hooks/useSidebar"
import { EVLogo } from "@/components/common/EVLogo"
import { cn } from "@/utils/cn"

interface NavItem {
  path: string
  label: string
  icon: any
  end?: boolean
}

const GithubIcon = (props: any) => (
  <svg className="size-5 fill-current" viewBox="0 0 24 24" {...props}>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
)

const PRIMARY_NAV: NavItem[] = [
  { path: PROTECTED_ROUTES.dashboard, label: "Home", icon: Home, end: true },
  { path: PROTECTED_ROUTES.roadmap, label: "Roadmap", icon: GitBranch },
  { path: PROTECTED_ROUTES.resume, label: "Resume Builder", icon: FileText },
  { path: PROTECTED_ROUTES.github, label: "GitHub Insights", icon: GithubIcon },
  { path: PROTECTED_ROUTES.analytics, label: "Analytics", icon: BarChart3 },
]

const ACCOUNT_NAV: NavItem[] = [
  { path: PROTECTED_ROUTES.profile, label: "Profile", icon: User },
  { path: PROTECTED_ROUTES.settings, label: "Settings", icon: Settings },
]

export const AppSidebar = memo(function AppSidebar() {
  const { isCollapsed, toggleSidebar } = useSidebar()

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "z-sidebar fixed inset-y-0 left-0 hidden text-[#F8FAFC] transition-[width] duration-200 ease-out md:flex md:flex-col justify-between select-none overflow-hidden sidebar-texture",
        isCollapsed ? "w-16" : "w-[260px]",
      )}
      style={{
        background: "linear-gradient(180deg, #0F172A 0%, #09090B 100%)",
      }}
    >
      {/* ── Soft Vertical Fading Seam Divider (replaces hard border) ─────────────── */}
      <div className="sidebar-glow-seam" />

      {/* ── Ambient Radial Glows (Top Violet, Bottom Teal) ────────────────────── */}
      <div className="absolute top-0 left-0 size-64 bg-[#7C3AED]/[0.08] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 size-64 bg-[#34D399]/[0.06] rounded-full blur-3xl pointer-events-none" />

      {/* ── Top Section ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col relative z-10">
        {/* Brand Header (~24px padding) */}
        <div className="p-6 pb-4">
          {!isCollapsed ? (
            <EVLogo variant="compact" />
          ) : (
            <span className="text-2xl font-black bg-gradient-to-r from-[#7C3AED] via-[#4F46E5] to-[#34D399] bg-clip-text text-transparent">
              EV
            </span>
          )}
        </div>

        {/* Soft Fading Horizontal Divider Seam */}
        <div className="px-6 my-2">
          <div className="divider-glow-seam" />
        </div>

        {/* Primary Navigation List */}
        <nav aria-label="Primary Navigation" className="space-y-2 px-3 pt-3">
          {PRIMARY_NAV.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                title={isCollapsed ? item.label : undefined}
                className={({ isActive }) =>
                  cn(
                    "flex h-[48px] items-center gap-3 rounded-[14px] px-3 text-sm font-medium transition-all duration-150 outline-none relative group",
                    isCollapsed && "justify-center px-0",
                    isActive
                      ? "glass-active-pill text-white font-bold"
                      : "text-[#94A3B8] hover:bg-white/[0.04] hover:text-[#F8FAFC]",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={cn("size-5 shrink-0 stroke-[2px] relative z-10", isActive ? "text-white" : "text-[#94A3B8] group-hover:text-[#F8FAFC]")} aria-hidden="true" />
                    <span className={cn("truncate relative z-10", isCollapsed && "sr-only")}>
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            )
          })}

          {/* Account Section (~24px top margin, label #64748B 11px letter-spacing 0.08em) */}
          <div className="pt-6 pb-1">
            {!isCollapsed && (
              <p className="px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-[0.08em] mb-2">
                ACCOUNT
              </p>
            )}
            {ACCOUNT_NAV.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  title={isCollapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    cn(
                      "flex h-[48px] items-center gap-3 rounded-[14px] px-3 text-sm font-medium transition-all duration-150 outline-none relative group",
                      isCollapsed && "justify-center px-0",
                      isActive
                        ? "glass-active-pill text-white font-bold"
                        : "text-[#94A3B8] hover:bg-white/[0.04] hover:text-[#F8FAFC]",
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={cn("size-5 shrink-0 stroke-[2px] relative z-10", isActive ? "text-white" : "text-[#94A3B8] group-hover:text-[#F8FAFC]")} aria-hidden="true" />
                      <span className={cn("truncate relative z-10", isCollapsed && "sr-only")}>
                        {item.label}
                      </span>
                    </>
                  )}
                </NavLink>
              )
            })}
          </div>
        </nav>
      </div>

      {/* ── Bottom Section ────────────────────────────────────────────────────── */}
      <div className="p-4 space-y-3 relative z-10">
        {/* EV AI Core Status Card (~16px margin, rounded-2xl ~20px, #18181B at ~85% opacity with backdrop blur) */}
        {!isCollapsed && (
          <div className="rounded-[20px] border border-white/10 bg-[#18181B]/85 backdrop-blur-md p-4 flex flex-col gap-1 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Fully-filled Radial Gradient Breathing Orb (~40px circle) */}
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="size-[40px] rounded-full shrink-0"
                  style={{
                    background: "radial-gradient(circle at 35% 35%, #7C3AED 0%, #34D399 100%)",
                    boxShadow: "0 0 20px rgba(52, 211, 153, 0.35)",
                  }}
                />
                <span className="text-[14px] font-bold text-white">EV AI Core</span>
              </div>

              {/* Online Indicator (green dot #22C55E ~6px + "Online" text in #22C55E 11px) */}
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#22C55E]">
                <span className="size-[6px] rounded-full bg-[#22C55E] animate-pulse" />
                <span>Online</span>
              </div>
            </div>

            <p className="text-[12px] text-[#94A3B8] mt-1">
              Your AI companion is ready.
            </p>
          </div>
        )}

        {/* Collapse Button */}
        <button
          onClick={toggleSidebar}
          className="flex h-10 w-full items-center gap-2 rounded-xl px-3 text-sm text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/[0.04] transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="size-5 shrink-0 mx-auto stroke-[2px]" />
          ) : (
            <>
              <ChevronLeft className="size-5 shrink-0 stroke-[2px]" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  )
})
