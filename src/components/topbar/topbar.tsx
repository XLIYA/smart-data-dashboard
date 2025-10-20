import { useLocation } from 'react-router-dom'
import { useState } from 'react'
import { Moon, Sun, Menu, X } from 'lucide-react'
import Brand from './brand'
import DesktopNav from './desktop-nav'
import MobileNav from './mobile-nav'
import { useDarkMode } from './use-dark-mode'

const Topbar = () => {
  const { pathname } = useLocation()
  const { dark, setDark } = useDarkMode()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-4 z-40 mb-6 px-4">
      <div className="bg-white/85 dark:bg-gray-900/85 backdrop-blur-2xl rounded-2xl border border-gray-200/40 dark:border-white/8 shadow-xl">
        <div className="px-6 h-16 flex items-center justify-between">
          {/* Logo & Branding */}
          <Brand onClick={() => setMobileMenuOpen(false)} />

          {/* Desktop Navigation */}
          <DesktopNav pathname={pathname} />

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDark(!dark)}
              className="p-2.5 rounded-xl border border-gray-200/60 dark:border-white/10 hover:bg-gray-100/80 dark:hover:bg-white/8 transition-all duration-300 hover:shadow-md"
              title={dark ? 'Light Mode' : 'Dark Mode'}
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {dark ? (
                <Sun className="w-5 h-5 text-yellow-500 transition-transform duration-300" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-500 transition-transform duration-300" />
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="md:hidden p-2.5 rounded-xl border border-gray-200/60 dark:border-white/10 hover:bg-gray-100/80 dark:hover:bg-white/8 transition-all duration-300"
              title="Menu"
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div id="mobile-nav">
          <MobileNav
            open={mobileMenuOpen}
            pathname={pathname}
            onNavigate={() => setMobileMenuOpen(false)}
          />
        </div>
      </div>
    </header>
  )
}

export default Topbar
