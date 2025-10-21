import { ReactNode } from 'react'
import { X } from 'lucide-react'

export default function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-3xl rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-700 px-4 py-3">
          <h3 className="text-base font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-zinc-100 dark:hover:bg-white/10 rounded-lg transition text-zinc-600 dark:text-zinc-400"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Content */}
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
}
