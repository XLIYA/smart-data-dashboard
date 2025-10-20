// src/components/ui/Select.tsx
import * as React from "react"
import { ChevronDown } from 'lucide-react'
import { cn } from "@/lib/utils"

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  placeholder?: string
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, placeholder, children, ...props }, ref) => (
    <div className="relative w-full">
      <select
        ref={ref}
        {...props}
        className={cn(
          "w-full px-4 py-2.5 pr-10 rounded-lg border border-slate-200 dark:border-white/10",
          "bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white",
          "appearance-none cursor-pointer transition-all",
          "hover:border-slate-300 dark:hover:border-white/20",
          "focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500",
          "text-sm font-medium",
          className
        )}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {children}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
    </div>
  )
)

Select.displayName = "Select"
export default Select