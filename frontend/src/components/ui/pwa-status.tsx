import { memo, useEffect, useState } from "react"
import { Wifi, WifiOff, X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

import { cn } from "@/utils/cn"

const DISMISSED_KEY = "ev-pwa-banner-dismissed"

/**
 * PWAInstallBanner — Placeholder PWA install prompt.
 * Dismissible. Does NOT implement service workers.
 */
export const PWAInstallBanner = memo(function PWAInstallBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem(DISMISSED_KEY)
    if (!dismissed) {
      /* Delay to not flash immediately on load */
      const t = setTimeout(() => setVisible(true), 3000)
      return () => clearTimeout(t)
    }
  }, [])

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, "1")
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="pwa-banner"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22 }}
          className="border-border bg-card/90 flex items-center gap-3 border-b px-4 py-2.5 text-sm backdrop-blur"
          role="banner"
          aria-label="Install EV app"
        >
          <span className="ai-gradient-text font-semibold">⚡</span>
          <span className="flex-1 text-foreground/80">
            Install EV for a faster experience.{" "}
            <button
              className="text-primary font-medium underline-offset-2 hover:underline"
              onClick={dismiss}
              aria-label="Install EV app (coming soon)"
            >
              Install
            </button>{" "}
            <span className="text-muted-foreground text-xs">(coming soon)</span>
          </span>
          <button
            onClick={dismiss}
            aria-label="Dismiss install banner"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="size-3.5" aria-hidden="true" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
})

/**
 * ConnectionStatus — Offline indicator.
 * Appears as a bottom-center toast when the user goes offline.
 * Purely UI — no service worker.
 */
export const ConnectionStatus = memo(function ConnectionStatus() {
  const [online, setOnline] = useState(navigator.onLine)

  useEffect(() => {
    const onOnline = () => setOnline(true)
    const onOffline = () => setOnline(false)
    window.addEventListener("online", onOnline)
    window.addEventListener("offline", onOffline)
    return () => {
      window.removeEventListener("online", onOnline)
      window.removeEventListener("offline", onOffline)
    }
  }, [])

  return (
    <AnimatePresence>
      {!online && (
        <motion.div
          key="offline-banner"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.22 }}
          className={cn(
            "fixed bottom-20 left-1/2 z-toast -translate-x-1/2",
            "flex items-center gap-2 rounded-full px-4 py-2",
            "bg-destructive/90 text-white text-sm font-medium shadow-float backdrop-blur",
          )}
          role="status"
          aria-live="polite"
          aria-label="You are offline"
        >
          <WifiOff className="size-4" aria-hidden="true" />
          You're offline
        </motion.div>
      )}
    </AnimatePresence>
  )
})

/**
 * OnlineIndicator — Small dot showing connection status.
 * Use in navbar or status areas.
 */
export function OnlineIndicator({ className }: { className?: string }) {
  const [online, setOnline] = useState(navigator.onLine)

  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener("online", on)
    window.addEventListener("offline", off)
    return () => {
      window.removeEventListener("online", on)
      window.removeEventListener("offline", off)
    }
  }, [])

  return (
    <span
      role="status"
      aria-label={online ? "Online" : "Offline"}
      className={cn("flex items-center gap-1.5 text-xs", className)}
    >
      {online ? (
        <Wifi className="text-accent size-3" aria-hidden="true" />
      ) : (
        <WifiOff className="text-destructive size-3" aria-hidden="true" />
      )}
    </span>
  )
}
