import * as echarts from 'echarts/core'
import { BarChart, LineChart, ScatterChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { ECharts } from 'echarts/core'

echarts.use([BarChart, LineChart, ScatterChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer])

export function initChart(el: HTMLDivElement): ECharts {
  return echarts.init(el, undefined, { renderer: 'canvas' })
}

// ✅ این دو تایپ را صراحتاً ری‌اِکسپورت کن تا از '@/lib/echarts' قابل import باشند
export type { ECharts } from 'echarts/core'
export type { EChartsOption } from 'echarts'
