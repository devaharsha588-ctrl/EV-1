import { Loader2 } from "lucide-react"
import { cn } from "@/utils/cn"

interface SpinnerProps {
  readonly className?: string
  readonly label?: string
}

export function Spinner({ className, label = "Loading" }: SpinnerProps) {
  return (
    <span
      aria-label={label}
      className={cn("inline-flex items-center justify-center gap-2 font-mono text-xs font-bold text-[#000000] uppercase tracking-wider", className)}
      role="status"
    >
      <Loader2 aria-hidden="true" className="size-4 animate-spin text-[#3B82F6]" />
      <span>{label}...</span>
    </span>
  )
}

export function Loader({ className, label = "Loading System" }: SpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3">
      <div className="w-8 h-8 bg-black rounded-[3px] flex items-center justify-center animate-pulse">
        <span className="text-white font-mono text-[10px] font-bold">EV</span>
      </div>
      <Spinner className={className} label={label} />
    </div>
  )
}
