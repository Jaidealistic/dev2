import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[100px] w-full rounded-xl border border-[#e8e5e0] bg-white px-4 py-3 text-sm font-medium shadow-sm transition-all duration-300 placeholder:text-[#9a9590] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7da47f]/40 focus-visible:border-[#7da47f] hover:border-[#7da47f]/50 hover:bg-[#f0f7f0] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
