import { Progress } from "@/components/ui/progress"
import { cn } from "@/utils/cn"

interface ProgressBarProps {
  readonly className?: string
  readonly label: string
  readonly value: number
}

export function ProgressBar({ className, label, value }: ProgressBarProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <div className="flex items-center justify-between gap-4 text-sm">
        <span className="text-foreground font-medium">{label}</span>
        <span className="text-muted-foreground tabular-nums">{value}%</span>
      </div>
      <Progress aria-label={label} value={value} />
    </div>
  )
}
