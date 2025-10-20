import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { getNavLinks } from './nav-links'
import { isActivePath } from './is-active'

type Props = {
  open: boolean
  pathname: string
  onNavigate: () => void
}

const MobileNav = ({ open, pathname, onNavigate }: Props) => {
  const ref = useRef<HTMLDivElement>(null)

  // ساده‌ترین focus trap وقتی منو باز است
  useEffect(() => {
    if (!open || !ref.current) return
    const container = ref.current
    const focusable = container.querySelectorAll<HTMLElement>(
      'a, button, [tabindex]:not([tabindex="-1"])'
    )
    focusable[0]?.focus()

    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open])

  if (!open) return null

  return (
    <nav
      ref={ref}
      className="md:hidden px-6 pb-4 flex flex-col gap-2 border-t border-gray-200/40 dark:border-white/8"
      aria-label="Mobile"
    >
      {getNavLinks().map(({ to, icon: Icon, title }) => (
        <Link
          key={to}
          to={to}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 ${
            isActivePath(pathname, to)
              ? 'bg-accent-500/20 text-accent-600 dark:text-accent-400'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-white/8'
          }`}
          onClick={onNavigate}
          aria-current={isActivePath(pathname, to) ? 'page' : undefined}
        >
          <Icon className="w-5 h-5" />
          <span className="font-medium">{title}</span>
        </Link>
      ))}
    </nav>
  )
}

export default MobileNav
