import { memo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

import { Pulse } from "@/components/ui/pulse"
import { cn } from "@/utils/cn"

interface AIFabProps {
  readonly className?: string
}

/**
 * AIFab — Floating AI Assistant entry point.
 *
 * Appears bottom-right on all protected pages. Uses EV Pulse branding.
 * Opens a placeholder panel — backend logic to be wired later.
 * Hidden on mobile (users use bottom nav or chat page directly).
 */
export const AIFab = memo(function AIFab({ className }: AIFabProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-[var(--z-fab)] hidden md:flex flex-col items-end gap-3",
        className,
      )}
    >
      <AnimatePresence>
        {expanded && (
          <motion.div
            key="fab-panel"
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
            className="glass-heavy border-border/60 mb-1 w-72 overflow-hidden rounded-2xl border shadow-float"
            role="dialog"
            aria-label="EV AI Assistant"
          >
            {/* Panel Header */}
            <div className="border-border/40 flex items-center gap-2.5 border-b px-4 py-3">
              <Pulse size="sm" />
              <div>
                <p className="ai-gradient-text text-sm font-semibold">EV AI Assistant</p>
                <p className="text-muted-foreground text-xs">Ready to help you grow</p>
              </div>
            </div>

            {/* Quick prompts */}
            <div className="p-3 space-y-1.5">
              {[
                "What should I focus on today?",
                "Review my career progress",
                "Suggest skills to learn",
                "Improve my resume",
              ].map((prompt) => (
                <button
                  key={prompt}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-primary/8 hover:text-foreground text-muted-foreground"
                  aria-label={`Ask: ${prompt}`}
                  onClick={() => {
                    /* TODO(backend): Open chat with pre-filled prompt */
                    setExpanded(false)
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Coming soon footer */}
            <div className="border-border/40 border-t px-4 py-2.5">
              <p className="text-muted-foreground text-xs">
                Full AI chat available in the{" "}
                <a
                  href="/chat"
                  className="text-primary underline-offset-2 hover:underline"
                  onClick={() => setExpanded(false)}
                >
                  Chat page
                </a>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB Button */}
      <motion.button
        aria-label={expanded ? "Close AI Assistant" : "Open EV AI Assistant"}
        aria-expanded={expanded}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setExpanded((v) => !v)}
        className="relative flex items-center gap-2.5 overflow-hidden rounded-full px-4 py-3 text-sm font-medium text-white shadow-float focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        style={{ background: "var(--ai-gradient)" }}
      >
        {/* Glow layer */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 animate-glow-breathe rounded-full"
          style={{ background: "var(--ai-gradient)", filter: "blur(8px)", opacity: 0.5 }}
        />

        {/* Content */}
        <span className="relative flex items-center gap-2">
          <Pulse size="xs" label="" animated={!expanded} className="brightness-150" />
          <span className="relative">
            {expanded ? "Close" : "Ask EV"}
          </span>
        </span>
      </motion.button>
    </div>
  )
})
