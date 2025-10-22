// src/components/chart-builder/chart-types.ts
import type { EChartsOption } from '@/lib/echarts'

export type ChartType = 'bar' | 'line' | 'scatter' | 'pie'
export type ColorScheme = 'default' | 'vibrant' | 'cool' | 'warm'

export interface ChartConfig {
  type: ChartType
  xAxis: string
  yAxis: string
  option: EChartsOption
  title?: string
  showGrid?: boolean
  showLegend?: boolean
  colorScheme?: ColorScheme
}

export interface ChartBuilderProps {
  open: boolean
  onClose: () => void
  data: any[]
  columns: { name: string; type: 'string' | 'number' | 'boolean' | 'date' }[]
  onAdd: (cfg: ChartConfig) => void
}