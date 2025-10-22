// src/components/ui/Modal.tsx
import { ReactNode, useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({
  open,
  title,
  onClose,
  children,
  maxWidth = 'max-w-4xl',
}: {
  open: boolean
  title: string | ReactNode
  onClose: () => void
  children: ReactNode
  maxWidth?: string
}) {
  // Close on ESC key
  useEffect(() => {
    if (!open) return
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [open, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative z-10 w-full ${maxWidth} rounded-2xl border border-zinc-200 dark:border-zinc-700 
          bg-white dark:bg-zinc-900 shadow-2xl max-h-[90vh] overflow-hidden flex flex-col
          animate-in slide-in-from-bottom-4 duration-300`}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-700 px-6 py-4 bg-gray-50/50 dark:bg-white/5">
          {typeof title === 'string' ? (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          ) : (
            title
          )}
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-white/10 rounded-lg transition text-zinc-600 dark:text-zinc-400 
              hover:text-zinc-900 dark:hover:text-zinc-100"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto scrollbar flex-1">{children}</div>
      </div>
    </div>
  )
}