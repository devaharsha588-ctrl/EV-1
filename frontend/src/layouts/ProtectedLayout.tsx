import { Outlet } from "react-router-dom"

import { AppSidebar } from "@/layouts/AppSidebar"
import { MobileBottomNavigation } from "@/layouts/MobileBottomNavigation"
import { TopNavbar } from "@/layouts/TopNavbar"
import { ConnectionStatus } from "@/components/ui/pwa-status"

export function ProtectedLayout() {
  return (
    <div className="h-dvh overflow-hidden bg-[#F5F5F5] text-[#000000]">
      <AppSidebar />
      <div className="flex h-dvh flex-col transition-[padding] duration-200 ease-out pl-0 md:pl-[260px]">
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
