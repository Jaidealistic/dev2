"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    ...props
}: CalendarProps) {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn("p-4", className)}
            formatters={{
                formatWeekdayName: (date) =>
                    date.toLocaleDateString("en-US", { weekday: "narrow" }),
            }}
            classNames={{
                // ── v9 Layout ──
                root: "",
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-3 w-[280px]",
                month_caption: "flex items-center justify-center mb-2 relative",
                caption_label: "hidden",
                nav: "absolute inset-x-0 flex items-center justify-between px-0",
                button_previous: cn(
                    buttonVariants({ variant: "outline" }),
                    "h-7 w-7 bg-white p-0 opacity-60 hover:opacity-100 hover:bg-[#f0f7f0] hover:border-[#7da47f]/40 hover:text-[#5a8c5c] transition-all duration-200 rounded-lg border-[#e8e5e0]"
                ),
                button_next: cn(
                    buttonVariants({ variant: "outline" }),
                    "h-7 w-7 bg-white p-0 opacity-60 hover:opacity-100 hover:bg-[#f0f7f0] hover:border-[#7da47f]/40 hover:text-[#5a8c5c] transition-all duration-200 rounded-lg border-[#e8e5e0]"
                ),
                // ── Grid ──
                month_grid: "w-full border-collapse",
                weekdays: "flex w-full",
                weekday: "flex-1 text-[#9a9590] font-semibold text-[11px] text-center py-2",
                week: "flex w-full",
                day: "flex-1 h-9 text-center text-sm p-0 relative flex items-center justify-center",
                day_button: cn(
                    buttonVariants({ variant: "ghost" }),
                    "h-9 w-9 p-0 font-medium text-[#4a4a4a] aria-selected:opacity-100 hover:bg-[#7da47f]/10 hover:text-[#3a6d3c] rounded-lg transition-all duration-150"
                ),
                // ── States ──
                selected: "bg-[#7da47f] text-white hover:bg-[#6b9770] hover:text-white focus:bg-[#6b9770] focus:text-white shadow-sm font-bold rounded-lg",
                today: "bg-[#f0f7f0] text-[#5a8c5c] font-bold ring-1 ring-[#7da47f]/30 rounded-lg",
                outside: "text-[#c0bbb5] opacity-40",
                disabled: "text-muted-foreground opacity-40",
                hidden: "invisible",
                range_start: "rounded-l-lg",
                range_end: "rounded-r-lg",
                range_middle: "aria-selected:bg-[#f0f7f0] aria-selected:text-[#5a8c5c]",
                // ── Dropdowns ──
                dropdowns: "flex items-center justify-center gap-1.5",
                dropdown_root: "relative",
                dropdown: "px-2.5 py-1 rounded-lg border border-[#e8e5e0] bg-white text-[12px] font-semibold text-[#3a3a3a] focus:outline-none focus:ring-1 focus:ring-[#7da47f] cursor-pointer hover:bg-[#f0f7f0] hover:border-[#7da47f]/50 transition-all duration-200 appearance-none text-center shadow-sm",
                months_dropdown: "",
                years_dropdown: "",
                // ── Chevron ──
                chevron: "h-4 w-4",
                ...classNames,
            }}
            components={{
                Chevron: ({ orientation }) => {
                    const Icon = orientation === "left" ? ChevronLeft : ChevronRight;
                    return <Icon className="h-4 w-4" aria-hidden="true" />;
                },
            }}
            {...props}
        />
    )
}
Calendar.displayName = "Calendar"

export { Calendar }
