interface EVLogoProps {
  readonly variant?: "full" | "compact"
  readonly className?: string
}

export function EVLogo({ variant = "compact", className = "" }: EVLogoProps) {
  if (variant === "compact") {
    return (
      <div className={`flex flex-col select-none ${className}`}>
        <span className="text-[32px] font-black tracking-tight leading-none bg-gradient-to-r from-[#7C3AED] via-[#4F46E5] to-[#34D399] bg-clip-text text-transparent">
          EV
        </span>
        <span className="text-[13px] font-normal text-[#94A3B8] tracking-normal mt-1">
          Empower. Learn. Evolve.
        </span>
      </div>
    )
  }

  return (
    <div className={`flex flex-col items-center justify-center text-center select-none ${className}`}>
      {/* SVG Logo Mark */}
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="eGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#4F46E5" />
          </linearGradient>
          <linearGradient id="vGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#34D399" />
          </linearGradient>
        </defs>

        {/* 3 Horizontal Tapered Chevron Bars for 'E' */}
        <path d="M 25 32 L 62 32 L 54 42 L 25 42 Z" fill="url(#eGrad)" />
        <path d="M 25 54 L 56 54 L 48 64 L 25 64 Z" fill="url(#eGrad)" />
        <path d="M 25 76 L 60 76 L 52 86 L 25 86 Z" fill="url(#eGrad)" />

        {/* Swooping Checkmark / Tick Shape for 'V' */}
        <path d="M 52 86 L 68 96 L 96 28 L 84 28 L 65 80 Z" fill="url(#vGrad)" />

        {/* 4-Point Sparkle Star at tip of V */}
        <path d="M 96 28 Q 96 20 102 20 Q 96 20 96 12 Q 96 20 90 20 Q 96 20 96 28 Z" fill="#34D399" />
      </svg>

      {/* Wordmark E V with side underline ticks */}
      <div className="relative flex items-center justify-center gap-6 mt-3">
        <div className="h-[2px] w-8 bg-gradient-to-r from-transparent to-[#7C3AED]" />
        <span className="text-2xl font-black text-[#F8FAFC] tracking-[0.25em]">E  V</span>
        <div className="h-[2px] w-8 bg-gradient-to-r from-[#34D399] to-transparent" />
      </div>

      {/* Tagline */}
      <span className="text-[13px] font-bold tracking-[0.18em] uppercase mt-2 bg-gradient-to-r from-[#7C3AED] via-[#4F46E5] to-[#34D399] bg-clip-text text-transparent">
        EMPOWER. LEARN. EVOLVE.
      </span>
    </div>
  )
}
