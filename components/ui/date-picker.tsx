"use client"

import * as React from "react"
import { format, getYear } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
    date?: Date | string
    onChange: (date: string) => void
    placeholder?: string
    className?: string
    isDark?: boolean
}

export function DatePicker({
    date,
    onChange,
    placeholder = "Pick a date",
    className,
    isDark = false,
}: DatePickerProps) {
    // Convert string date from state to Date object for the calendar
    const selectedDate = React.useMemo(() => {
        if (!date) return undefined
        const parsedDate = new Date(date)
        return isNaN(parsedDate.getTime()) ? undefined : parsedDate
    }, [date])

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-semibold px-4 py-2.5 h-11 rounded-xl text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#7da47f]/40 focus:border-[#7da47f] border-[#e8e5e0] hover:border-[#7da47f]/50 hover:bg-[#f0f7f0] hover:shadow-md group shadow-sm",
                        !date && "text-[#9a9590]",
                        isDark ? "bg-gray-800 border-gray-700 text-white hover:bg-gray-750" : "bg-white text-[#3a3a3a]",
                        className
                    )}
                >
                    <CalendarIcon className="mr-2.5 h-4 w-4 text-[#7da47f] transition-all group-hover:text-[#5a8c5c] group-hover:scale-110" aria-hidden="true" />
                    {selectedDate ? (
                        <span className={cn(
                            "font-bold",
                            isDark ? "text-white" : "text-[#3a3a3a]"
                        )}>
                            {format(selectedDate, "PPP")}
                        </span>
                    ) : (
                        <span className={isDark ? "text-gray-500" : "text-[#9a9590]"}>{placeholder}</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className={cn(
                    "w-auto p-0 rounded-2xl border border-[#e8e5e0]/80 bg-white/95 backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12),0_10px_30px_-10px_rgba(125,164,127,0.1)] overflow-hidden",
                    isDark && "bg-gray-900/95 border-gray-700"
                )}
                align="start"
            >
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(d) => {
                        if (d) {
                            const year = d.getFullYear();
                            const month = String(d.getMonth() + 1).padStart(2, '0');
                            const day = String(d.getDate()).padStart(2, '0');
                            onChange(`${year}-${month}-${day}`);
                        }
                    }}
                    disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                    }
                    captionLayout="dropdown"
                    fromYear={1900}
                    toYear={new Date().getFullYear()}
                    initialFocus
                    className={cn(
                        "rounded-2xl",
                        isDark ? "bg-gray-900 text-white border-gray-800" : "bg-transparent"
                    )}
                />
            </PopoverContent>
        </Popover>
    )
}
