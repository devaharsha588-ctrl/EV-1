import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { LogOut, X } from "lucide-react"

import { PUBLIC_ROUTES } from "@/constants/routes"
import { useAuth, useLogoutMutation } from "@/hooks/useAuth"
import { useProfile } from "@/hooks/useProfile"
import { Button } from "@/components/ui/button"

export function TopNavbar() {
  const { session } = useAuth()
  const { profile } = useProfile()
  const logoutMutation = useLogoutMutation()
  const navigate = useNavigate()
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const displayName = profile.nickname || profile.name || session?.user?.name || "User"
  const userInitial = (displayName[0] || "U").toUpperCase()

  const handleSignOut = async () => {
    try {
      setShowConfirmModal(false)
      await logoutMutation.mutateAsync()
      toast.success("Signed out successfully.")
      navigate(PUBLIC_ROUTES.login)
    } catch {
      toast.error("Failed to sign out.")
    }
  }

  return (
    <>
      <header className="z-nav relative flex h-[64px] shrink-0 items-center justify-between px-6 select-none bg-white border-b border-black/[0.06]">
        {/* Left Title / Branding */}
        <div className="flex items-center gap-3">
          <span className="label-mono text-[#526E7A] tracking-widest text-[11px]">WORKSPACE ACTIVE</span>
        </div>

        {/* Right: Profile Avatar (Bell Icon Removed) */}
        <div className="flex items-center gap-2 ml-auto">
          {/* User Avatar Button */}
          <button
            onClick={() => setShowConfirmModal(true)}
            className="relative group cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-black rounded-[4px]"
            title={`Signed in as ${displayName} · Click to sign out`}
            aria-label="User Profile"
          >
            <div className="size-[36px] rounded-[4px] bg-[#000000] flex items-center justify-center text-white font-mono text-sm font-bold shadow-sm hover:scale-105 active:scale-95 transition-transform">
              {userInitial}
            </div>
            <span className="size-[8px] rounded-full bg-[#10B981] ring-2 ring-white absolute -bottom-0.5 -right-0.5" />
          </button>
        </div>
      </header>

      {/* ── Custom EV AI Sign Out Confirmation Modal ────── */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirmModal(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 10 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="relative z-10 w-full max-w-sm rounded-[6px] border border-black/10 bg-white p-6 shadow-2xl space-y-4"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowConfirmModal(false)}
                className="absolute top-4 right-4 p-1 rounded-[3px] text-[#526E7A] hover:text-black hover:bg-black/[0.04] transition-colors"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>

              {/* Header Label */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-black rounded-[3px] flex items-center justify-center shrink-0">
                    <span className="text-white font-mono text-[8px] font-bold">EV</span>
                  </div>
                  <span className="label-mono text-[#526E7A] text-[10px]">EV AI SESSION // LOGOUT</span>
                </div>
                <h2 className="text-xl font-semibold text-[#000000] tracking-tight pt-1">
                  Sign Out of EV AI?
                </h2>
              </div>

              {/* Description Body */}
              <p className="text-xs text-[#526E7A] leading-relaxed">
                Signed in as <strong className="text-black">{displayName}</strong>. Are you sure you want to end your active session? All progress is securely saved.
              </p>

              {/* Action Buttons Row */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-black/[0.06]">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowConfirmModal(false)}
                  className="rounded-[4px] font-mono text-xs text-[#333333] border-black/15 hover:bg-black/[0.04]"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSignOut}
                  className="rounded-[4px] font-mono text-xs bg-black hover:bg-red-600 text-white transition-colors flex items-center gap-1.5"
                >
                  <LogOut className="size-3.5" />
                  Sign Out
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
