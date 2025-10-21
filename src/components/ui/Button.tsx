import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary'|'secondary'|'ghost';
  size?: 'sm'|'md'|'lg';
};

export default function Button({ className, variant='primary', size='md', ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md',
        size === 'sm' ? 'px-3 py-1.5 text-sm' : size === 'lg' ? 'px-5 py-3 text-base' : 'px-4 py-2.5 text-sm',
        variant === 'secondary' ? 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700' :
        variant === 'ghost' ? 'bg-transparent hover:bg-black/5 dark:hover:bg-white/10' :
        'bg-accent-500 text-white hover:bg-accent-600 active:bg-accent-700',
        className
      )}
    />
  )
}
