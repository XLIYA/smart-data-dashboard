// src/App.tsx
import { Outlet } from 'react-router-dom'
import Topbar from './components/Topbar'
import { ToastProvider } from './components/ui/toast'

export default function App() {
  return (
    <ToastProvider>
      <div
        className="min-h-screen bg-app-gradient text-slate-800 dark:text-slate-100"
        dir="ltr"
      >
        <Topbar />
        <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
          <main><Outlet /></main>
          <footer className="pt-8 pb-6 text-sm text-slate-500/80 text-center">
            © {new Date().getFullYear()} Smart Data Dashboard
          </footer>
        </div>
      </div>
    </ToastProvider>
  )
}