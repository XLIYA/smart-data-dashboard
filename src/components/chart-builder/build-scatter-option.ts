// src/components/chart-builder/build-scatter-option.ts
import { getThemeColors } from './get-theme-colors'
import type { EChartsOption } from '@/lib/echarts'
import type { DataSet, Row, Cell } from '@/types/data'
// تایپ رسمی پارامتر formatter در ECharts:
import type {
  TopLevelFormatterParams,
  CallbackDataParams
} from 'echarts/types/dist/shared'

/**
 * دو امضا برای سازگاری:
 * - فرم فعلی شما: xAxis, yAxis, isDark
 * - فرم جایگزین:  xKey,  yKey,  dark
 */
export interface BuildScatterArgsXY {
  xAxis: string
  yAxis: string
  data: DataSet
  isDark: boolean
}

export interface BuildScatterArgsKeyed {
  xKey: keyof Row | string
  yKey: keyof Row | string
  data: DataSet
  dark: boolean
}

export type BuildScatterArgs = BuildScatterArgsXY | BuildScatterArgsKeyed

/** کمکی: Cell → number (نامعتبر → NaN) */
function toNumber(v: Cell): number {
  if (typeof v === 'number') return v
  if (v instanceof Date) return v.getTime()
  if (typeof v === 'boolean') return v ? 1 : 0
  if (v == null) return NaN
  const n = Number(v)
  return Number.isNaN(n) ? NaN : n
}

/** استخراج امن X,Y از پارامتر formatter */
function extractXY(params: TopLevelFormatterParams): [number, number] | null {
  const item: CallbackDataParams = Array.isArray(params)
    ? (params[0] as CallbackDataParams)
    : (params as CallbackDataParams)

  const val = item?.value
  if (Array.isArray(val) && val.length >= 2) {
    const x = typeof val[0] === 'number' ? val[0] : Number(val[0])
    const y = typeof val[1] === 'number' ? val[1] : Number(val[1])
    if (Number.isFinite(x) && Number.isFinite(y)) return [x, y]
  }
  return null
}

export const buildScatterOption = (params: BuildScatterArgs): EChartsOption => {
  // نرمال‌سازی ورودی‌ها
  const x = 'xAxis' in params ? params.xAxis : String(params.xKey)
  const y = 'yAxis' in params ? params.yAxis : String(params.yKey)
  const dark = 'isDark' in params ? params.isDark : params.dark
  const data: DataSet = params.data

  if (!x || !y || !Array.isArray(data) || data.length === 0) return {}

  // ساخت داده‌های [x,y]
  const scatterData: [number, number][] = data
    .slice(0, 200)
    .map((r) => {
      const xv = toNumber(r[x])
      const yv = toNumber(r[y])
      return [xv, yv] as [number, number]
    })
    .filter(([dx, dy]) => Number.isFinite(dx) && Number.isFinite(dy))

  const colors = getThemeColors(dark)

  const option: EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: colors.bgColor,
      borderColor: colors.borderColor,
      textStyle: { color: colors.textColor, fontSize: 13 },
      // ✅ امضای رسمی با TopLevelFormatterParams
      formatter: (p: TopLevelFormatterParams) => {
        const xy = extractXY(p)
        if (!xy) return `<strong>${y}</strong>`
        const [vx, vy] = xy
        return `<strong>${y}</strong><br/>X: ${vx.toFixed(2)}<br/>Y: ${vy.toFixed(2)}`
      },
      borderWidth: 1,
      padding: [10, 15],
    },
    legend: {
      data: [y],
      textStyle: { color: colors.textColor, fontSize: 13 },
      top: 15,
    },
    grid: {
      left: 70,
      right: 40,
      top: 60,
      bottom: 60,
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      axisLabel: { color: colors.textColor, fontSize: 12, margin: 8 },
      axisLine: { lineStyle: { color: colors.gridColor, width: 1.5 } },
      splitLine: { lineStyle: { color: colors.gridColor, type: 'dashed', width: 0.8 } },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: colors.textColor, fontSize: 12, margin: 8 },
      axisLine: { lineStyle: { color: colors.gridColor, width: 1.5 } },
      splitLine: { lineStyle: { color: colors.gridColor, type: 'dashed', width: 0.8 } },
    },
    series: [
      {
        type: 'scatter',
        data: scatterData,
        symbolSize: [10, 10],
        itemStyle: {
          color: colors.gradientStart,
          opacity: 0.75,
          borderColor: '#fff',
          borderWidth: 2,
          shadowColor: 'rgba(0,0,0,0.2)',
          shadowBlur: 6,
        },
        emphasis: {
          itemStyle: {
            color: colors.gradientStart,
            opacity: 1,
            borderColor: '#fff',
            borderWidth: 3,
            shadowBlur: 12,
            shadowColor: colors.gradientStart,
          },
        },
        animationDuration: 300,
      },
    ],
  }

  return option
}
