import * as React from "react"
import { cn } from "@/utils/cn"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "input-clean flex h-10 w-full px-3 py-2 text-sm text-[#000000] placeholder:text-[#A0A0A0] font-[Inter] disabled:cursor-not-allowed disabled:opacity-40 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        className,
      )}
      {...props}
    />
  )
}

export { Input }
