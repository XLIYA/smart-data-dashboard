// src/components/chart-builder/build-axis-option.ts
import { ChartType } from './chart-types'
import { getThemeColors } from './get-theme-colors'
import type { EChartsOption } from '@/lib/echarts'
import type { DataSet, Row, Cell } from '@/types/data'

/** امضا ۱: فرم فعلی شما */
export interface BuildAxisArgsXY {
  type: ChartType
  xAxis: string
  yAxis: string
  data: DataSet
  isDark: boolean
}

/** امضا ۲: فرم پیشنهادی قبلی */
export interface BuildAxisArgsKeyed {
  seriesType: Exclude<ChartType, 'scatter'> | 'bar' | 'line'
  xKey: keyof Row | string
  yKey: keyof Row | string
  data: DataSet
  dark: boolean
}

export type BuildAxisArgs = BuildAxisArgsXY | BuildAxisArgsKeyed

/** کمکی: Cell → number (نامعتبر → NaN) */
function toNumber(v: Cell): number {
  if (typeof v === 'number') return v
  if (v instanceof Date) return v.getTime()
  if (typeof v === 'boolean') return v ? 1 : 0
  if (v == null) return NaN
  const n = Number(v)
  return Number.isNaN(n) ? NaN : n
}

/** آرایه یکتا از رشته‌ها */
function uniqueStrings(arr: string[]): string[] {
  const set = new Set<string>()
  for (const s of arr) if (s) set.add(s)
  return Array.from(set)
}

export const buildAxisOption = (raw: BuildAxisArgs): EChartsOption => {
  // نرمال‌سازی ورودی‌ها برای پشتیبانی از هر دو امضا
  const seriesType: 'bar' | 'line' =
    'type' in raw ? (raw.type === 'line' ? 'line' : 'bar') : raw.seriesType
  const x = 'xAxis' in raw ? raw.xAxis : String(raw.xKey)
  const y = 'yAxis' in raw ? raw.yAxis : String(raw.yKey)
  const dark = 'isDark' in raw ? raw.isDark : raw.dark
  const data: DataSet = raw.data

  if (!x || !y || !Array.isArray(data) || data.length === 0) return {}

  // استخراج دسته‌های محور X (به‌صورت یکتا، حداکثر 50)
  const xDataAll = data.map((r) => String(r[x] ?? ''))
  const xData = uniqueStrings(xDataAll).slice(0, 50)

  // محاسبه مقدار Y برای هر دسته X (میانگین مقادیر)
  const yData: number[] = xData.map((cat) => {
    const vals = data
      .filter((r) => String(r[x] ?? '') === cat)
      .map((r) => toNumber(r[y]))
      .filter((v) => Number.isFinite(v))
    if (vals.length === 0) return 0
    const sum = vals.reduce((a, b) => a + b, 0)
    return sum / vals.length
  })

  const colors = getThemeColors(dark)

  const baseOption: EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: colors.bgColor,
      borderColor: colors.borderColor,
      textStyle: { color: colors.textColor, fontSize: 13 },
      axisPointer: { type: 'shadow', shadowStyle: { color: 'rgba(0,0,0,0.1)' } },
      borderWidth: 1,
      padding: [10, 15],
      transitionDuration: 0.3
    },
    legend: {
      data: [y],
      textStyle: { color: colors.textColor, fontSize: 13, fontWeight: 500 },
      icon: 'rect',
      top: 15,
      padding: [0, 0]
    },
    grid: {
      left: 70,
      right: 40,
      top: 60,
      bottom: 60,
      containLabel: true
      // توجه: خصوصیات ظاهری شبکه (رنگ، نمایش) را با splitLine محور‌ها کنترل می‌کنیم
    },
    xAxis: {
      type: 'category',
      data: xData,
      axisLabel: { color: colors.textColor, fontSize: 12, interval: 'auto', margin: 8 },
      axisLine: { lineStyle: { color: colors.gridColor, width: 1.5 } },
      axisTick: { lineStyle: { color: colors.gridColor } },
      splitLine: { show: false }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: colors.textColor, fontSize: 12, margin: 8 },
      axisLine: { lineStyle: { color: colors.gridColor, width: 1.5 } },
      splitLine: { lineStyle: { color: colors.gridColor, type: 'dashed', width: 0.8 } }
    }
  }

  if (seriesType === 'bar') {
    const option: EChartsOption = {
      ...baseOption,
      series: [
        {
          name: y,
          type: 'bar',
          data: yData,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: colors.gradientStart },
                { offset: 1, color: colors.gradientEnd }
              ]
            },
            borderRadius: [10, 10, 0, 0],
            opacity: 0.88,
            shadowColor: 'rgba(0,0,0,0.15)',
            shadowBlur: 8,
            shadowOffsetY: 4
          },
          barWidth: '45%',
          barGap: '20%',
          barCategoryGap: '30%',
          label: {
            show: false,
            color: colors.textColor,
            fontSize: 11,
            position: 'top',
            distance: 5
          },
          emphasis: {
            itemStyle: {
              opacity: 1,
              shadowColor: colors.gradientStart,
              shadowBlur: 15,
              shadowOffsetY: 6
            }
          },
          animationDuration: 500,
          animationEasing: 'cubicOut'
        }
      ]
    }
    return option
  }

  // line
  const option: EChartsOption = {
    ...baseOption,
    series: [
      {
        name: y,
        type: 'line',
        data: yData,
        smooth: 0.35,
        symbolSize: 8,
        itemStyle: {
          color: colors.gradientStart,
          borderColor: '#fff',
          borderWidth: 2,
          shadowColor: 'rgba(0,0,0,0.2)',
          shadowBlur: 6
        },
        lineStyle: {
          width: 3.5,
          color: colors.gradientStart,
          shadowColor: 'rgba(0,0,0,0.1)',
          shadowBlur: 8,
          shadowOffsetY: 2
        },
        areaStyle: { color: colors.primaryLight, origin: 'start' },
        emphasis: {
          focus: 'series',
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 3,
            shadowBlur: 12,
            shadowColor: colors.gradientStart,
            shadowOffsetY: 4
          },
          lineStyle: { width: 4.5 }
        },
        animationDuration: 500,
        animationEasing: 'cubicOut'
      }
    ]
  }

  return option
}
