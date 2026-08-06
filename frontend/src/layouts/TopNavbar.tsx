import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Bell, Sun, Moon, PanelLeftClose, PanelLeftOpen } from "lucide-react"

import { PUBLIC_ROUTES } from "@/constants/routes"
import { useAuth, useLogoutMutation } from "@/hooks/useAuth"
import { useProfile } from "@/hooks/useProfile"
import { useSidebar } from "@/hooks/useSidebar"
import { useTheme } from "@/hooks/useTheme"

export function TopNavbar() {
  const { session } = useAuth()
  const { profile } = useProfile()
  const logoutMutation = useLogoutMutation()
  const navigate = useNavigate()
  
  const { isCollapsed, toggleSidebar } = useSidebar()
  const { theme, toggleTheme } = useTheme()

  const displayName = profile.nickname || profile.name || session?.user?.name || "Shrawan"
  const userInitial = (displayName[0] || "S").toUpperCase()

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
    <header className="z-nav relative flex h-16 shrink-0 items-center justify-between px-4 sm:px-6 select-none border-b border-white/5">
      {/* Left Side: Sidebar Toggle */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="hidden md:flex p-2 rounded-lg hover:bg-white/5 text-muted-foreground transition-colors"
          aria-label="Toggle Sidebar"
        >
          {isCollapsed ? (
            <PanelLeftOpen className="size-5" />
          ) : (
            <PanelLeftClose className="size-5" />
          )}
        </button>
      </div>

      {/* Right Side: Notifications, Theme Toggle, Profile Avatar */}
      <div className="flex items-center gap-2 sm:gap-4 ml-auto">
        <button className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground transition-colors relative" aria-label="Notifications">
          <Bell className="size-5" />
          <span className="absolute top-2 right-2 size-1.5 rounded-full bg-[#34D399]" />
        </button>

        <button 
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground transition-colors"
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? (
            <Moon className="size-5" />
          ) : (
            <Sun className="size-5" />
          )}
        </button>

        <div
          className="relative group cursor-pointer ml-2"
          onClick={handleSignOut}
          title="Click to Sign Out"
        >
          <div className="size-[40px] rounded-full bg-[#312E81] flex items-center justify-center text-white font-bold text-base shadow-md">
            {userInitial}
          </div>
          <span className="size-3 rounded-full bg-[#22C55E] ring-2 ring-[#09090B] absolute bottom-0 right-0" />
        </div>
      </div>
    </header>
  )
}
