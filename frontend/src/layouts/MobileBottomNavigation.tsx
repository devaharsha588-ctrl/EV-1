import { NavLink } from "react-router-dom"
import { motion } from "framer-motion"

import { MOBILE_NAVIGATION } from "@/constants/navigation"
import { cn } from "@/utils/cn"

export function MobileBottomNavigation() {
  return (
    <nav
      aria-label="Mobile primary"
      className="z-mobile fixed inset-x-3 bottom-3 md:hidden"
    >
      <div className="glass-heavy shadow-float grid grid-cols-5 rounded-2xl p-1.5 backdrop-blur-xl">
        {MOBILE_NAVIGATION.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "relative flex h-13 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[0.68rem] font-medium transition-colors outline-none",
                  isActive
                    ? "text-white font-semibold"
                    : "text-muted-foreground hover:text-foreground",
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="mobile-active-pill"
                      className="ai-gradient absolute inset-0 rounded-xl shadow-soft"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <Icon aria-hidden="true" className="relative z-10 size-4 shrink-0" />
                  <span className="relative z-10 max-w-full truncate">{item.label}</span>
                </>
              )}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
