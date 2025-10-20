// src/components/Topbar.tsx
import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Home, Eye, LayoutDashboard, Moon, Sun, BarChart3 } from 'lucide-react'

export default function Topbar() {
  const { pathname } = useLocation()
  const [dark, setDark] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    document.body.className = dark
      ? 'dark bg-gray-900 text-gray-100'
      : 'bg-gray-50 text-gray-900'
  }, [dark])

  const isActive = (path: string) => pathname === path || pathname.startsWith(path)

  const navClass = (active: boolean) =>
    `p-2.5 rounded-xl transition-all duration-300 ${
      active
        ? 'bg-accent-500/20 text-accent-600 dark:text-accent-400 shadow-md ring-1 ring-accent-500/30'
        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-white/8 hover:text-gray-900 dark:hover:text-white'
    }`

  return (
    <header className="sticky top-4 z-40 mb-6 px-4">
      <div className="bg-white/85 dark:bg-gray-900/85 backdrop-blur-2xl rounded-2xl border border-gray-200/40 dark:border-white/8 shadow-xl">
        <div className="px-6 h-16 flex items-center justify-between">
          {/* Logo & Branding */}
          <Link to="/" className="flex items-center gap-3 group hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg bg-gradient-to-r from-accent-600 to-cyan-600 dark:from-accent-400 dark:to-cyan-400 bg-clip-text text-transparent">
                DataViz Pro
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-500 leading-none">
                Smart Dashboard Builder
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1.5">
            <Link
              to="/"
              className={navClass(isActive('/'))}
              title="Home"
            >
              <Home className="w-5 h-5" />
            </Link>
            <Link
              to="/preview"
              className={navClass(isActive('/preview'))}
              title="Preview"
            >
              <Eye className="w-5 h-5" />
            </Link>
            <Link
              to="/dashboard"
              className={navClass(isActive('/dashboard'))}
              title="Dashboard"
            >
              <LayoutDashboard className="w-5 h-5" />
            </Link>
          </nav>

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
        </div>
      </div>
    </header>
  )
}