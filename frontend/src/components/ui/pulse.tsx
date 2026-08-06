import { type HTMLAttributes, memo } from "react"

import { cn } from "@/utils/cn"

interface PulseProps extends HTMLAttributes<HTMLSpanElement> {
  readonly size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
  readonly animated?: boolean
  readonly label?: string
}

const sizeMap = {
  xs: { box: 14, orbit: 12, orbitSw: 1, core: 4, halo: 20 },
  sm: { box: 18, orbit: 15, orbitSw: 1.2, core: 5, halo: 26 },
  md: { box: 22, orbit: 18, orbitSw: 1.4, core: 6, halo: 32 },
  lg: { box: 30, orbit: 26, orbitSw: 1.6, core: 8, halo: 44 },
  xl: { box: 40, orbit: 34, orbitSw: 1.8, core: 10, halo: 60 },
  "2xl": { box: 60, orbit: 50, orbitSw: 2, core: 14, halo: 84 },
}

export const Pulse = memo(function Pulse({
  size = "md",
  animated = true,
  label = "EV AI",
  className,
  style,
  ...props
}: PulseProps) {
  const { box, orbit, orbitSw, core, halo } = sizeMap[size]

  const r = orbit / 2 - orbitSw / 2
  const circumference = 2 * Math.PI * r
  const dashArray = `${circumference * 0.65} ${circumference * 0.35}`

  return (
    <span
      role="img"
      aria-label={label}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center",
        className,
      )}
      style={{ width: box, height: box, ...style }}
      {...props}
    >
      {/* Outer breathing halo */}
      {animated && (
        <span
          aria-hidden="true"
          className="absolute rounded-full pointer-events-none"
          style={{
            width: halo,
            height: halo,
            background: "radial-gradient(circle, rgba(52, 211, 153, 0.25) 0%, rgba(139, 92, 246, 0.12) 50%, transparent 75%)",
            animation: "pulse-halo 3s ease-in-out infinite",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      )}

      {/* Rotating orbital ring */}
      <svg
        aria-hidden="true"
        width={box}
        height={box}
        viewBox={`0 0 ${box} ${box}`}
        fill="none"
        style={{
          position: "absolute",
          inset: 0,
          animation: animated ? "orbit-spin 3s linear infinite" : undefined,
        }}
      >
        <circle
          cx={box / 2}
          cy={box / 2}
          r={r}
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth={orbitSw}
          fill="none"
        />
        <circle
          cx={box / 2}
          cy={box / 2}
          r={r}
          stroke="url(#ev-pulse-arc-grad)"
          strokeWidth={orbitSw + 0.4}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={dashArray}
          strokeDashoffset={0}
        />
        <defs>
          <linearGradient id="ev-pulse-arc-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4338CA" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#34D399" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center glowing core */}
      <span
        aria-hidden="true"
        className="relative rounded-full"
        style={{
          width: core,
          height: core,
          background: "radial-gradient(circle, #34D399 0%, #8B5CF6 60%, #4338CA 100%)",
          boxShadow: animated ? "0 0 10px rgba(52, 211, 153, 0.8), 0 0 18px rgba(139, 92, 246, 0.5)" : undefined,
          zIndex: 1,
        }}
      />
    </span>
  )
})

export function PulseLabel({
  label = "EV AI",
  size = "sm",
  className,
}: {
  label?: string
  size?: PulseProps["size"]
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-xs font-semibold tracking-wide uppercase",
        "text-glow-gradient",
        className,
      )}
    >
      <Pulse size={size} label={label} />
      {label}
    </span>
  )
}
