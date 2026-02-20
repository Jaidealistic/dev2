import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border border-[#e8e5e0] bg-white px-4 py-2.5 text-sm font-medium shadow-sm transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-[#9a9590] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7da47f]/40 focus-visible:border-[#7da47f] hover:border-[#7da47f]/50 hover:bg-[#f0f7f0] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
