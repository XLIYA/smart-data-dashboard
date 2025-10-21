import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

export const Select = SelectPrimitive.Root
export const SelectGroup = SelectPrimitive.Group
export const SelectValue = SelectPrimitive.Value

export const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className = "", children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={[
      "inline-flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm",
      "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700",
      "hover:bg-zinc-50 dark:hover:bg-zinc-800",
      "outline-none focus:ring-2 focus:ring-accent-500/50",
      "transition-colors",
      className,
    ].join(" ")}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="ml-2 h-4 w-4 opacity-70" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = "SelectTrigger"

export const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className = "", children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      position={position}
      className={[
        "z-50 min-w-[8rem] overflow-hidden rounded-xl border border-zinc-200",
        "bg-white dark:bg-zinc-900 shadow-md dark:border-zinc-700",
        className,
      ].join(" ")}
      {...props}
    >
      <SelectPrimitive.ScrollUpButton className="flex items-center justify-center py-1">
        <ChevronUp className="h-4 w-4 opacity-70" />
      </SelectPrimitive.ScrollUpButton>
      <SelectPrimitive.Viewport className="p-1">
        {children}
      </SelectPrimitive.Viewport>
      <SelectPrimitive.ScrollDownButton className="flex items-center justify-center py-1">
        <ChevronDown className="h-4 w-4 opacity-70" />
      </SelectPrimitive.ScrollDownButton>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = "SelectContent"

export const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className = "", children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={[
      "relative flex w-full cursor-pointer select-none items-center rounded-lg",
      "px-2 py-2 text-sm outline-none",
      "data-[highlighted]:bg-zinc-100 dark:data-[highlighted]:bg-white/10",
      className,
    ].join(" ")}
    {...props}
  >
    <SelectPrimitive.ItemIndicator className="absolute right-2 inline-flex">
      <Check className="h-4 w-4 opacity-70" />
    </SelectPrimitive.ItemIndicator>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = "SelectItem"
