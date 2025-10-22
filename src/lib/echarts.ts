// روش پیشنهادی برای شما (ترکیبی)
import * as echarts from 'echarts/core'
import { BarChart, LineChart, ScatterChart, PieChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

// Simple but flexible
export type EChartsOption = echarts.EChartsCoreOption
export type ECharts = echarts.ECharts

echarts.use([
  BarChart,
  LineChart,
  ScatterChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  CanvasRenderer,
])

export function initChart(el: HTMLDivElement): ECharts {
  return echarts.init(el, undefined, { renderer: 'canvas' })
}

export { echarts }