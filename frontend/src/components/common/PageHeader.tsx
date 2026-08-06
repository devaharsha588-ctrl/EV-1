import type { ReactNode } from "react"

import { cn } from "@/utils/cn"

interface PageHeaderProps {
  readonly actions?: ReactNode
  readonly className?: string
  readonly description?: string
  readonly title: string
}

export function PageHeader({
  actions,
  className,
  description,
  title,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "border-border flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="grid gap-2">
        <h1 className="text-foreground text-3xl font-semibold sm:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="text-muted-foreground max-w-2xl text-sm leading-6">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex items-center gap-2">{actions}</div>
      ) : null}
    </header>
  )
}
