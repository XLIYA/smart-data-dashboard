// src/components/Topbar.tsx
import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Home, Eye, LayoutDashboard, Moon, Sun, BarChart3, Menu, X } from 'lucide-react'

export default function Topbar() {
  const { pathname } = useLocation()
  const [dark, setDark] = useState(() => {
    // Read from localStorage on mount
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Save to localStorage whenever dark mode changes
    localStorage.setItem('darkMode', JSON.stringify(dark))
    
    // Update DOM
    document.documentElement.classList.toggle('dark', dark)
    document.body.classList.toggle('bg-gray-900', dark)
    document.body.classList.toggle('text-gray-100', dark)
    document.body.classList.toggle('bg-gray-50', !dark)
    document.body.classList.toggle('text-gray-900', !dark)
  }, [dark])

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname === path || pathname.startsWith(path + '/')
  }

  const navClass = (active: boolean) =>
    `p-2.5 rounded-xl transition-all duration-300 ${
      active
        ? 'bg-accent-500/20 text-accent-600 dark:text-accent-400 shadow-md ring-1 ring-accent-500/30'
        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-white/8 hover:text-gray-900 dark:hover:text-white'
    }`

  const navLinks = [
    { to: '/', icon: Home, title: 'Home' },
    { to: '/preview', icon: Eye, title: 'Preview' },
    { to: '/dashboard', icon: LayoutDashboard, title: 'Dashboard' },
  ]

  return (
    <header className="sticky top-4 z-40 mb-6 px-4">
      <div className="bg-white/85 dark:bg-gray-900/85 backdrop-blur-2xl rounded-2xl border border-gray-200/40 dark:border-white/8 shadow-xl">
        <div className="px-6 h-16 flex items-center justify-between">
          {/* Logo & Branding */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group hover:opacity-80 transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          >
            <img 
              src="/logo.png" 
              alt="BluViz" 
              className="w-14 h-14 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow object-cover"
            />
            <div>
              <span className="font-bold text-lg bg-gradient-to-r from-accent-600 to-cyan-600 dark:from-accent-400 dark:to-cyan-400 bg-clip-text text-transparent">
                BluViz
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-500 leading-none">
                Smart Dashboard Builder
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 ml-auto mr-4">
            {navLinks.map(({ to, icon: Icon, title }) => (
              <Link
                key={to}
                to={to}
                className={navClass(isActive(to))}
                title={title}
              >
                <Icon className="w-5 h-5" />
              </Link>
            ))}
          </nav>

          {/* Right Side Controls */}
          <div className="flex items-center gap-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDark(!dark)}
              className="p-2.5 rounded-xl border border-gray-200/60 dark:border-white/10 hover:bg-gray-100/80 dark:hover:bg-white/8 transition-all duration-300 hover:shadow-md"
              title={dark ? 'Light Mode' : 'Dark Mode'}
            >
              {dark ? (
                <Sun className="w-5 h-5 text-yellow-500 transition-transform duration-300" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-500 transition-transform duration-300" />
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl border border-gray-200/60 dark:border-white/10 hover:bg-gray-100/80 dark:hover:bg-white/8 transition-all duration-300"
              title="Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden px-6 pb-4 flex flex-col gap-2 border-t border-gray-200/40 dark:border-white/8">
            {navLinks.map(({ to, icon: Icon, title }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 ${
                  isActive(to)
                    ? 'bg-accent-500/20 text-accent-600 dark:text-accent-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-white/8'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{title}</span>
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}