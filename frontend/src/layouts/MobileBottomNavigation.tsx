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
      <div
        className="bg-white border border-black/[0.08] grid rounded-[6px] p-1.5 shadow-float"
        style={{ gridTemplateColumns: `repeat(${MOBILE_NAVIGATION.length}, 1fr)` }}
      >
        {MOBILE_NAVIGATION.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "relative flex h-12 flex-col items-center justify-center gap-1 rounded-[4px] px-1 text-[0.65rem] font-medium transition-colors outline-none",
                  isActive
                    ? "text-white"
                    : "text-[#526E7A] hover:text-[#000000]",
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="mobile-active-pill"
                      className="absolute inset-0 rounded-[4px] bg-black"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <Icon aria-hidden="true" className="relative z-10 size-4 shrink-0" />
                  <span className="relative z-10 max-w-full truncate font-mono tracking-wider uppercase" style={{ fontSize: "9px" }}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
