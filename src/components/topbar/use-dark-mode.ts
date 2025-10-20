import { useEffect, useState } from 'react'

const STORAGE_KEY = 'darkMode'

export const useDarkMode = () => {
  const [dark, setDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved != null) return JSON.parse(saved)
      // fallback به سیستم اگر چیزی ذخیره نشده
      return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dark))
    } catch { /* ignore quota */ }

    const dd = document.documentElement
    const body = document.body

    dd.classList.toggle('dark', dark)
    body.classList.toggle('bg-gray-900', dark)
    body.classList.toggle('text-gray-100', dark)
    body.classList.toggle('bg-gray-50', !dark)
    body.classList.toggle('text-gray-900', !dark)
  }, [dark])

  return { dark, setDark }
}
