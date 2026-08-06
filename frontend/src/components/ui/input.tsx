import * as React from "react"

import { cn } from "@/utils/cn"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "input-clean h-11 w-full min-w-0 px-4 py-2 text-sm text-[#F5F7FA] placeholder:text-[#A7B0C0]/60 transition-all outline-none disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  )
}

export { Input }
