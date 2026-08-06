import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

import { cn } from "@/utils/cn"

interface EmptyStateProps {
  readonly action?: ReactNode
  readonly className?: string
  readonly description: string
  readonly icon?: LucideIcon
  readonly title: string
}

export function EmptyState({
  action,
  className,
  description,
  icon: Icon,
  title,
}: EmptyStateProps) {
  return (
    <section
      className={cn(
        "border-border bg-card/60 grid min-h-64 place-items-center rounded-lg border border-dashed px-6 py-12 text-center",
        className,
      )}
    >
      <div className="grid max-w-md justify-items-center gap-4">
        {Icon ? (
          <span className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-md">
            <Icon aria-hidden="true" className="size-5" />
          </span>
        ) : null}
        <div className="grid gap-2">
          <h2 className="text-foreground text-xl font-semibold">{title}</h2>
          <p className="text-muted-foreground text-sm leading-6">
            {description}
          </p>
        </div>
        {action ? <div>{action}</div> : null}
      </div>
    </section>
  )
}
