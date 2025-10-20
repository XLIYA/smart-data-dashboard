import { useCallback, useEffect, useState } from 'react'
import type { ChartEntry } from './types'

const STORAGE_KEY = 'bluviz.dashboard.charts'

export const useCharts = () => {
  const [charts, setCharts] = useState<ChartEntry[]>([])

  // load once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as ChartEntry[]
        if (Array.isArray(parsed)) setCharts(parsed)
      }
    } catch {/* ignore */}
  }, [])

  // persist on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(charts))
    } catch {/* ignore */}
  }, [charts])

  const addChart = useCallback((entry: Omit<ChartEntry, 'id'>) => {
    setCharts(prev => [...prev, { id: Date.now(), ...entry }])
  }, [])

  const removeChart = useCallback((id: number) => {
    setCharts(prev => prev.filter(c => c.id !== id))
  }, [])

  const clearCharts = useCallback(() => setCharts([]), [])

  return { charts, addChart, removeChart, clearCharts }
}
