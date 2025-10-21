import type { EChartsOption } from '@/lib/echarts'

export type ChartType = 'bar' | 'line' | 'scatter'

export interface ChartConfig {
  type: ChartType
  xAxis: string
  yAxis: string
  option: EChartsOption         // ← اجباری است
}

export interface ChartBuilderProps {
  open: boolean
  onClose: () => void
  data: any[]                   // اگر تایپ مرکزی داری، از DataSet استفاده کن
  columns: { name: string; type: 'string'|'number'|'boolean'|'date' }[]
  onAdd: (cfg: ChartConfig) => void
}
