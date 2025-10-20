export type ChartType = 'bar' | 'line' | 'scatter'

export type ChartEntry = {
  id: number
  option: any
  type: ChartType
  xAxis: string
  yAxis: string
}
