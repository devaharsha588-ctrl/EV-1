import { LoaderCircle } from "lucide-react"

import { cn } from "@/utils/cn"

interface SpinnerProps {
  readonly className?: string
  readonly label?: string
}

export function Spinner({ className, label = "Loading" }: SpinnerProps) {
  return (
    <span
      aria-label={label}
      className={cn("inline-flex items-center justify-center", className)}
      role="status"
    >
      <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
    </span>
  )
}

export function Loader({ className, label }: SpinnerProps) {
  return <Spinner className={className} label={label} />
}
