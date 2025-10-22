// src/components/topbar/topbar.tsx
import { useLocation } from 'react-router-dom'
import { useState } from 'react'
import { Moon, Sun, Menu, X, Trash2 } from 'lucide-react'
import Brand from './brand'
import DesktopNav from './desktop-nav'
import MobileNav from './mobile-nav'
import { useDarkMode } from './use-dark-mode'
import { useDataStore } from '@/stores/dataStore'
import { useChartStore } from '@/stores/chartStore'

const Topbar = () => {
  const { pathname } = useLocation()
  const { dark, setDark } = useDarkMode()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const reset = useDataStore((s) => s.reset)
  const clearCharts = useChartStore((s) => s.clearCharts)

  const handleReset = () => {
    if (confirm('Are you sure you want to clear all data and charts?')) {
      reset()
      clearCharts()
      window.location.href = '/'
    }
  }

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
            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="hidden md:flex p-2.5 rounded-xl border border-gray-200/60 dark:border-white/10 hover:bg-red-50 dark:hover:bg-red-500/10 hover:border-red-300 dark:hover:border-red-500/30 transition-all duration-300 hover:shadow-md group"
              title="Clear All Data"
              aria-label="Clear all data and charts"
            >
              <Trash2 className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDark(!dark)}
              className="p-2.5 rounded-xl border border-gray-200/60 dark:border-white/10 hover:bg-gray-100/80 dark:hover:bg-white/8 transition-all duration-300 hover:shadow-md"
              title={dark ? 'Light Mode' : 'Dark Mode'}
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {dark ? (
                <Sun className="w-5 h-5 text-yellow-500 transition-transform duration-300 hover:rotate-45" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-500 transition-transform duration-300 hover:-rotate-12" />
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