import { ResponsiveContainer, type ResponsiveContainerProps } from "recharts"

import { cn } from "@/utils/cn"

interface ChartContainerProps extends Omit<
  ResponsiveContainerProps,
  "children"
> {
  readonly children: ResponsiveContainerProps["children"]
  readonly className?: string
}

export function ChartContainer({
  children,
  className,
  height = 320,
  width = "100%",
  ...props
}: ChartContainerProps) {
  return (
    <div
      className={cn(
        "border-border bg-card min-h-40 w-full overflow-hidden rounded-lg border p-4",
        className,
      )}
    >
      <ResponsiveContainer height={height} width={width} {...props}>
        {children}
      </ResponsiveContainer>
    </div>
  )
}
