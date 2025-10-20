import { Home, Eye, LayoutDashboard } from 'lucide-react'

export type NavLink = { to: string; title: string; icon: any }

export const getNavLinks = (): NavLink[] => ([
  { to: '/', icon: Home, title: 'Home' },
  { to: '/preview', icon: Eye, title: 'Preview' },
  { to: '/dashboard', icon: LayoutDashboard, title: 'Dashboard' },
])
