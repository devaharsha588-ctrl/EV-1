import type { ReactNode } from "react"
import { cn } from "@/utils/cn"

interface PageHeaderProps {
  readonly actions?: ReactNode
  readonly className?: string
  readonly description?: string
  readonly title: string
  readonly label?: string
}

export function PageHeader({
  actions,
  className,
  description,
  title,
  label,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-4 border-b border-black/[0.07] pb-6 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="grid gap-1.5">
        {label && (
          <span className="label-mono text-[#526E7A]">{label}</span>
        )}
        <h1 className="text-[28px] sm:text-[32px] font-light tracking-tighter text-[#000000] leading-tight">
          {title}
        </h1>
        {description ? (
          <p className="text-[#526E7A] max-w-2xl text-sm leading-relaxed">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex items-center gap-2 shrink-0">{actions}</div>
      ) : null}
    </header>
  )
}
