import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes } from 'react'

export default function Button({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium',
        'bg-accent-500 text-white hover:bg-accent-600 active:bg-accent-700 transition-all',
        'shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
    />
  )
}