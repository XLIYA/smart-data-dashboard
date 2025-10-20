export type ChartType = 'bar' | 'line' | 'scatter'

export interface ChartConfig {
  option: any
  type: ChartType
  xAxis: string
  yAxis: string
}

export interface ChartBuilderProps {
  open: boolean
  onClose: () => void
  data: any[]
  columns: any[]
  onAdd: (cfg: ChartConfig) => void
}
