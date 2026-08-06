import { memo } from "react"
import { NavLink } from "react-router-dom"
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
import { cn } from "@/utils/cn"

interface NavItem {
  path: string
  label: string
  icon: any
  end?: boolean
}

const GithubIcon = (props: any) => (
  <svg className="size-4 fill-current" viewBox="0 0 24 24" {...props}>
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
    <aside
      className={cn(
        "z-sidebar fixed inset-y-0 left-0 hidden bg-white text-[#000000] transition-[width] duration-200 ease-out md:flex md:flex-col justify-between select-none overflow-hidden",
        isCollapsed ? "w-16" : "w-[260px]",
      )}
    >
      {/* Right border seam */}
      <div className="sidebar-glow-seam" />

      {/* Top Section */}
      <div className="flex flex-col">

        {/* Brand Header */}
        <div className="h-[64px] flex items-center px-5 border-b border-black/[0.06]">
          {!isCollapsed ? (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-black rounded-[3px] flex items-center justify-center">
                <span className="text-white font-mono text-[11px] font-bold tracking-widest">EV</span>
              </div>
              <div>
                <span className="font-mono text-[11px] font-bold tracking-[0.14em] uppercase text-black">EV AI</span>
                <span className="block font-mono text-[9px] text-[#526E7A] tracking-[0.1em] uppercase">Navigator</span>
              </div>
            </div>
          ) : (
            <div className="w-7 h-7 bg-black rounded-[3px] flex items-center justify-center mx-auto">
              <span className="text-white font-mono text-[10px] font-bold">EV</span>
            </div>
          )}
        </div>

        {/* Primary Navigation */}
        <nav aria-label="Primary Navigation" className="px-3 pt-4 space-y-0.5">
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
                    "flex h-[40px] items-center gap-3 px-3 text-[13px] font-medium transition-all duration-150 outline-none rounded-[4px] group",
                    isCollapsed && "justify-center px-0",
                    isActive
                      ? "bg-[#000000] text-white"
                      : "text-[#526E7A] hover:bg-black/[0.04] hover:text-[#000000]",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={cn(
                        "size-4 shrink-0",
                        isActive ? "text-white" : "text-[#526E7A] group-hover:text-[#000000]"
                      )}
                      aria-hidden="true"
                    />
                    <span className={cn("truncate", isCollapsed && "sr-only")}>
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            )
          })}

          {/* Account Section */}
          <div className="pt-4 pb-1">
            {!isCollapsed && (
              <p className="px-3 label-mono text-[#526E7A] mb-2">
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
                      "flex h-[40px] items-center gap-3 px-3 text-[13px] font-medium transition-all duration-150 outline-none rounded-[4px] group",
                      isCollapsed && "justify-center px-0",
                      isActive
                        ? "bg-[#000000] text-white"
                        : "text-[#526E7A] hover:bg-black/[0.04] hover:text-[#000000]",
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={cn(
                          "size-4 shrink-0",
                          isActive ? "text-white" : "text-[#526E7A] group-hover:text-[#000000]"
                        )}
                        aria-hidden="true"
                      />
                      <span className={cn("truncate", isCollapsed && "sr-only")}>
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

      {/* Bottom Section */}
      <div className="p-4 space-y-2 border-t border-black/[0.06]">
        {/* EV AI Core Status */}
        {!isCollapsed && (
          <div className="rounded-[4px] border border-black/[0.07] bg-[#F5F5F5] p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-black rounded-[3px] flex items-center justify-center shrink-0">
                <span className="text-white font-mono text-[9px] font-bold tracking-wider">EV</span>
              </div>
              <div>
                <p className="font-mono text-[11px] font-bold tracking-[0.1em] text-black uppercase">EV AI Core</p>
                <p className="text-[10px] text-[#526E7A]">Your AI companion is ready.</p>
              </div>
            </div>
            <div className="status-online">
              <span className="status-dot animate-glow-breathe" />
            </div>
          </div>
        )}

        {/* Collapse Button */}
        <button
          onClick={toggleSidebar}
          className="flex h-9 w-full items-center gap-2 rounded-[4px] px-3 text-xs text-[#526E7A] hover:text-[#000000] hover:bg-black/[0.04] transition-colors font-mono uppercase tracking-wider"
          aria-label="Toggle sidebar"
        >
          {isCollapsed ? (
            <ChevronRight className="size-4 shrink-0 mx-auto" />
          ) : (
            <>
              <ChevronLeft className="size-4 shrink-0" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  )
})
