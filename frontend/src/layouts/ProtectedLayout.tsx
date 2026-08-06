import { Outlet } from "react-router-dom"

import { AppSidebar } from "@/layouts/AppSidebar"
import { MobileBottomNavigation } from "@/layouts/MobileBottomNavigation"
import { TopNavbar } from "@/layouts/TopNavbar"
import { useSidebar } from "@/hooks/useSidebar"
import { ConnectionStatus } from "@/components/ui/pwa-status"
import { cn } from "@/utils/cn"

export function ProtectedLayout() {
  const { isCollapsed } = useSidebar()

  return (
    <div className="h-dvh overflow-hidden bg-[#F5F5F5] text-[#000000]">
      <AppSidebar />
      <div
        className={cn(
          "flex h-dvh flex-col transition-[padding] duration-200 ease-out pl-0",
          isCollapsed ? "md:pl-16" : "md:pl-[260px]"
        )}
      >
        <div className="shrink-0">
          <TopNavbar />
        </div>
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0 scrollbar-thin">
          <Outlet />
        </main>
        <MobileBottomNavigation />
      </div>
      <ConnectionStatus />
    </div>
  )
}

