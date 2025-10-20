import { cn } from '@/lib/utils'

export default function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        'rounded-2xl shadow-sm border backdrop-blur-md transition-all',
        'bg-white/70 border-gray-200 dark:bg-white/5 dark:border-white/10',
        'hover:shadow-md',
        className
      )}
    />
  )
}