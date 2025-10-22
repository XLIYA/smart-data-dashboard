// src/stores/chartStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ChartType = 'bar' | 'line' | 'scatter' | 'pie'
export type ColorScheme = 'default' | 'vibrant' | 'cool' | 'warm'

export interface ChartEntry {
  id: number
  option: any
  type: ChartType
  xAxis: string
  yAxis: string
  title?: string
  showGrid?: boolean
  showLegend?: boolean
  colorScheme?: ColorScheme
}

interface ChartState {
  charts: ChartEntry[]
  addChart: (chart: Omit<ChartEntry, 'id'>) => void
  removeChart: (id: number) => void
  clearCharts: () => void
  setCharts: (charts: ChartEntry[]) => void
}

export const useChartStore = create<ChartState>()(
  persist(
    (set) => ({
      charts: [],
      addChart: (chart) =>
        set((state) => ({
          charts: [...state.charts, { ...chart, id: Date.now() }],
        })),
      removeChart: (id) =>
        set((state) => ({
          charts: state.charts.filter((c) => c.id !== id),
        })),
      clearCharts: () => set({ charts: [] }),
      setCharts: (charts) => set({ charts }),
    }),
    {
      name: 'bluviz-charts-storage',
      version: 1,
    }
  )
)