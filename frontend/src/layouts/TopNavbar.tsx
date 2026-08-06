import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Bell, PanelLeftClose, PanelLeftOpen } from "lucide-react"

import { PUBLIC_ROUTES } from "@/constants/routes"
import { useAuth, useLogoutMutation } from "@/hooks/useAuth"
import { useProfile } from "@/hooks/useProfile"
import { useSidebar } from "@/hooks/useSidebar"

export function TopNavbar() {
  const { session } = useAuth()
  const { profile } = useProfile()
  const logoutMutation = useLogoutMutation()
  const navigate = useNavigate()
  const { isCollapsed, toggleSidebar } = useSidebar()

  const displayName = profile.nickname || profile.name || session?.user?.name || "User"
  const userInitial = (displayName[0] || "U").toUpperCase()

  const handleSignOut = async () => {
    try {
      await logoutMutation.mutateAsync()
      toast.success("Signed out successfully.")
      navigate(PUBLIC_ROUTES.login)
    } catch {
      toast.error("Failed to sign out.")
    }
  }

  return (
    <header className="z-nav relative flex h-[64px] shrink-0 items-center justify-between px-6 select-none bg-white border-b border-black/[0.06]">
      {/* Left: Sidebar Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="hidden md:flex p-2 rounded-[4px] hover:bg-black/[0.04] text-[#526E7A] hover:text-black transition-colors"
          aria-label="Toggle Sidebar"
        >
          {isCollapsed ? (
            <PanelLeftOpen className="size-4" />
          ) : (
            <PanelLeftClose className="size-4" />
          )}
        </button>
      </div>

      {/* Right: Notifications, Profile */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Notification Bell */}
        <button
          className="p-2 rounded-[4px] hover:bg-black/[0.04] text-[#526E7A] hover:text-black transition-colors relative"
          aria-label="Notifications"
        >
          <Bell className="size-4" />
          <span className="absolute top-2 right-2 size-1.5 rounded-full bg-[#10B981]" />
        </button>

        {/* User Avatar */}
        <div
          className="relative group cursor-pointer ml-1"
          onClick={handleSignOut}
          title={`Signed in as ${displayName} · Click to sign out`}
        >
          <div className="size-[36px] rounded-[4px] bg-[#000000] flex items-center justify-center text-white font-mono text-sm font-bold">
            {userInitial}
          </div>
          <span className="size-[8px] rounded-full bg-[#10B981] ring-2 ring-white absolute -bottom-0.5 -right-0.5" />
        </div>
      </div>
    </header>
  )
}
