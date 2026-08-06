import {
  type KeyboardEvent,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import {
  BarChart3,
  FileText,
  GitBranch,
  Home,
  Map,
  MessageCircle,
  Search,
  Settings,
  UserRound,
  Zap,
} from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

import { PROTECTED_ROUTES } from "@/constants/routes"
import { cn } from "@/utils/cn"
import { Pulse } from "@/components/ui/pulse"

/* ── Types ──────────────────────────────────────────────── */
interface CommandItem {
  id: string
  label: string
  description?: string
  icon: React.ComponentType<{ className?: string }>
  path?: string
  group: "nav" | "ai" | "recent"
  shortcut?: string
}

interface CommandPaletteProps {
  readonly open: boolean
  readonly onClose: () => void
}

/* ── Data ───────────────────────────────────────────────── */
const NAV_COMMANDS: CommandItem[] = [
  { id: "dashboard",  label: "Dashboard",  description: "AI mission control",          icon: Home,        path: PROTECTED_ROUTES.dashboard,  group: "nav" },
  { id: "chat",       label: "Chat",       description: "Talk to your AI companion",   icon: MessageCircle, path: PROTECTED_ROUTES.chat,     group: "nav" },
  { id: "roadmap",    label: "Roadmap",    description: "Your career timeline",         icon: Map,         path: PROTECTED_ROUTES.roadmap,    group: "nav" },
  { id: "resume",     label: "Resume",     description: "AI-powered resume builder",   icon: FileText,    path: PROTECTED_ROUTES.resume,     group: "nav" },
  { id: "github",     label: "GitHub",     description: "Code intelligence overview",  icon: GitBranch,   path: PROTECTED_ROUTES.github,     group: "nav" },
  { id: "analytics",  label: "Analytics",  description: "Your learning insights",      icon: BarChart3,   path: PROTECTED_ROUTES.analytics,  group: "nav" },
  { id: "profile",    label: "Profile",    description: "Manage your profile",         icon: UserRound,   path: PROTECTED_ROUTES.profile,    group: "nav" },
  { id: "settings",   label: "Settings",   description: "App preferences",             icon: Settings,    path: PROTECTED_ROUTES.settings,   group: "nav" },
]

const AI_COMMANDS: CommandItem[] = [
  { id: "ai-career", label: "Ask about my career", description: "Get personalized advice", icon: Zap, group: "ai" },
  { id: "ai-resume", label: "Improve my resume",   description: "AI-powered suggestions",  icon: Zap, group: "ai" },
  { id: "ai-roadmap",label: "Generate roadmap",    description: "Plan your next steps",    icon: Zap, group: "ai" },
]

/* ── Component ──────────────────────────────────────────── */
export const CommandPalette = memo(function CommandPalette({
  open,
  onClose,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("")
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  /* Focus input when opened */
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 60)
      setQuery("")
      setActiveIndex(0)
    }
  }, [open])

  /* Filter items */
  const allItems = [...NAV_COMMANDS, ...AI_COMMANDS]
  const filtered = query.trim()
    ? allItems.filter(
        (item) =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          item.description?.toLowerCase().includes(query.toLowerCase()),
      )
    : allItems

  const grouped = {
    nav:    filtered.filter((i) => i.group === "nav"),
    ai:     filtered.filter((i) => i.group === "ai"),
    recent: filtered.filter((i) => i.group === "recent"),
  }

  /* Keyboard navigation */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Escape") { onClose(); return }
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1))
      }
      if (e.key === "ArrowUp") {
        e.preventDefault()
        setActiveIndex((i) => Math.max(i - 1, 0))
      }
      if (e.key === "Enter" && filtered[activeIndex]) {
        const item = filtered[activeIndex]
        if (item.path) { navigate(item.path); onClose() }
      }
    },
    [filtered, activeIndex, navigate, onClose],
  )

  const handleSelect = useCallback(
    (item: CommandItem) => {
      if (item.path) { navigate(item.path); onClose() }
    },
    [navigate, onClose],
  )

  let flatIndex = 0

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cp-backdrop"
            aria-hidden="true"
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            style={{ zIndex: "var(--z-modal)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            key="cp-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="fixed left-1/2 top-[15vh] w-full max-w-xl -translate-x-1/2 overflow-hidden rounded-2xl shadow-float"
            style={{ zIndex: "calc(var(--z-modal) + 1)" }}
            initial={{ opacity: 0, scale: 0.95, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.18, ease: [0.2, 0, 0, 1] }}
            onKeyDown={handleKeyDown}
          >
            {/* Glass panel */}
            <div className="glass-heavy border-border/60 overflow-hidden rounded-2xl border">
              {/* Search input */}
              <div className="border-border/50 flex items-center gap-3 border-b px-4 py-3">
                <Search className="text-muted-foreground size-4 shrink-0" aria-hidden="true" />
                <input
                  ref={inputRef}
                  type="text"
                  role="combobox"
                  aria-expanded="true"
                  aria-autocomplete="list"
                  aria-controls="cp-results"
                  placeholder="Search pages or ask EV AI…"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setActiveIndex(0) }}
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
                />
                <kbd className="border-border bg-muted text-muted-foreground hidden rounded px-1.5 py-0.5 text-xs sm:inline-block">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div
                id="cp-results"
                role="listbox"
                className="scrollbar-thin max-h-[60vh] overflow-y-auto p-2"
              >
                {filtered.length === 0 ? (
                  <p className="text-muted-foreground px-3 py-8 text-center text-sm">
                    No results for "{query}"
                  </p>
                ) : (
                  <>
                    {grouped.nav.length > 0 && (
                      <CommandGroup label="Navigate">
                        {grouped.nav.map((item) => {
                          const idx = flatIndex++
                          return (
                            <CommandRow
                              key={item.id}
                              item={item}
                              isActive={activeIndex === idx}
                              onSelect={handleSelect}
                              onHover={() => setActiveIndex(idx)}
                            />
                          )
                        })}
                      </CommandGroup>
                    )}

                    {grouped.ai.length > 0 && (
                      <CommandGroup label="Ask EV AI">
                        {grouped.ai.map((item) => {
                          const idx = flatIndex++
                          return (
                            <CommandRow
                              key={item.id}
                              item={item}
                              isActive={activeIndex === idx}
                              isAI
                              onSelect={handleSelect}
                              onHover={() => setActiveIndex(idx)}
                            />
                          )
                        })}
                      </CommandGroup>
                    )}
                  </>
                )}
              </div>

              {/* Footer hint */}
              <div className="border-border/50 flex items-center gap-4 border-t px-4 py-2">
                <span className="text-muted-foreground flex items-center gap-1 text-xs">
                  <kbd className="border-border rounded border px-1">↑↓</kbd> navigate
                </span>
                <span className="text-muted-foreground flex items-center gap-1 text-xs">
                  <kbd className="border-border rounded border px-1">↵</kbd> open
                </span>
                <span className="text-muted-foreground flex items-center gap-1 text-xs">
                  <kbd className="border-border rounded border px-1">ESC</kbd> close
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
})

/* ── Sub-components ─────────────────────────────────────── */
function CommandGroup({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="mb-2">
      <p className="text-muted-foreground px-3 py-1.5 text-xs font-medium uppercase tracking-wider">
        {label}
      </p>
      {children}
    </div>
  )
}

function CommandRow({
  item,
  isActive,
  isAI = false,
  onSelect,
  onHover,
}: {
  item: CommandItem
  isActive: boolean
  isAI?: boolean
  onSelect: (item: CommandItem) => void
  onHover: () => void
}) {
  const Icon = item.icon

  return (
    <button
      role="option"
      aria-selected={isActive}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors",
        isActive
          ? "bg-primary/10 text-foreground"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
      )}
      onClick={() => onSelect(item)}
      onMouseEnter={onHover}
    >
      {isAI ? (
        <Pulse size="xs" className="shrink-0" />
      ) : (
        <Icon className="size-4 shrink-0 opacity-70" aria-hidden="true" />
      )}
      <span className="flex-1 font-medium">{item.label}</span>
      {item.description && (
        <span className="text-muted-foreground/70 hidden truncate text-xs sm:block">
          {item.description}
        </span>
      )}
    </button>
  )
}
