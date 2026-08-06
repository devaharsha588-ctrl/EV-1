import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/utils/cn"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-full font-medium text-sm whitespace-nowrap transition-all duration-150 outline-none select-none disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-[#5B7CFA] active:scale-[0.99] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-[#5B7CFA] text-white hover:bg-[#4A6CE8]",
        ai:
          "bg-[#5B7CFA] text-white hover:bg-[#4A6CE8]",
        secondary:
          "bg-[#7B61FF] text-white hover:bg-[#6A4FE8]",
        outline:
          "border border-white/10 bg-[#151922] text-[#F5F7FA] hover:bg-[#1C2230] hover:border-white/20",
        ghost:
          "text-[#A7B0C0] hover:bg-white/5 hover:text-[#F5F7FA]",
        destructive:
          "bg-[#FF6B6B]/10 border border-[#FF6B6B]/20 text-[#FF6B6B] hover:bg-[#FF6B6B]/20",
        link: "text-[#5B7CFA] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 gap-2",
        xs: "h-7 px-3 text-xs gap-1",
        sm: "h-8 px-4 text-xs gap-1.5",
        lg: "h-12 px-6 text-sm gap-2 font-semibold",
        xl: "h-13 px-7 text-base gap-2.5 font-semibold",
        icon: "size-10 rounded-full",
        "icon-sm": "size-8 rounded-full",
        "icon-lg": "size-11 rounded-full",
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
