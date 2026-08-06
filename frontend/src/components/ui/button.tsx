import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/utils/cn"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center font-medium text-sm whitespace-nowrap transition-all duration-200 outline-none select-none disabled:pointer-events-none disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-1 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-[#000000] text-white hover:bg-[#1a1a1a] rounded-[4px]",
        ai:
          "bg-[#3B82F6] text-white hover:bg-[#2563EB] rounded-[4px]",
        secondary:
          "bg-[#F5F5F5] text-[#000000] border border-[rgba(0,0,0,0.1)] hover:bg-[#EBEBEB] rounded-[4px]",
        outline:
          "border border-[#000000] bg-transparent text-[#000000] hover:bg-[#F5F5F5] rounded-[4px]",
        ghost:
          "bg-transparent text-[#526E7A] hover:bg-[rgba(0,0,0,0.04)] hover:text-[#000000] rounded-[4px]",
        destructive:
          "bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] hover:bg-[#EF4444]/15 rounded-[4px]",
        link: "text-[#3B82F6] underline-offset-4 hover:underline rounded-[4px]",
      },
      size: {
        default: "h-10 px-5 gap-2",
        xs: "h-7 px-3 text-xs gap-1",
        sm: "h-8 px-4 text-xs gap-1.5",
        lg: "h-11 px-6 text-sm gap-2 font-semibold",
        xl: "h-12 px-7 text-base gap-2.5 font-semibold",
        icon: "size-10",
        "icon-sm": "size-8",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
