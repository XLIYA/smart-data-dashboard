// src/components/chart-builder/build-axis-option.ts
import type { EChartsOption } from '@/lib/echarts'
import { getThemeColors } from './get-theme-colors'
import type { DataSet } from '@/types/data'
import type { ChartType } from './chart-types'

export interface BuildAxisArgsXY {
  type: Exclude<ChartType, 'scatter'>
  xAxis: string
  yAxis: string
  data: DataSet
  isDark: boolean
}
// ...
export function buildAxisOption({ type, xAxis, yAxis, data, isDark }: BuildAxisArgsXY): EChartsOption {
  const colors = getThemeColors(isDark)

  const xs: any[] = data.map((row) => row?.[xAxis])
  const ys: number[] = data.map((row) => {
    const v = row?.[yAxis]
    const n = typeof v === 'number' ? v : (v instanceof Date ? v.getTime() : Number(v))
    return Number.isFinite(n) ? n : 0
  })

  const option: EChartsOption = {
    backgroundColor: 'transparent', // ⬅️ مهم
    grid: { left: 48, right: 24, top: 32, bottom: 48, containLabel: true },
    textStyle: { color: colors.textColor },
    // Hover را غیرفعال یا به کلیک محدود کن (بخش B را ببین)
    tooltip: {
      trigger: 'axis',
      triggerOn: 'click',            // ⬅️ فقط با کلیک
      axisPointer: { type: 'none' }, // ⬅️ خط‌نمای محور حذف
    },
    xAxis: {
      type: 'category',
      data: xs,
      axisLine: { lineStyle: { color: colors.borderColor } },
      axisTick: { alignWithLabel: true },
      axisLabel: { color: colors.textColor },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisLabel: { color: colors.textColor },
      splitLine: { show: true, lineStyle: { color: colors.gridColor } },
    },
    series: [
      {
        type,
        data: ys,
        smooth: type === 'line',
        // ❌ این دو خط را حذف/خاموش کن تا پس‌زمینه آبی نیاد
        showBackground: false,
        // backgroundStyle: { color: colors.primaryLight },

        itemStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: colors.gradientStart },
              { offset: 1, color: colors.gradientEnd },
            ],
          },
          shadowBlur: 0,
          shadowColor: 'transparent',
          shadowOffsetY: 0,
        },
        lineStyle: type === 'line' ? { width: 3 } : undefined,
        emphasis: { disabled: true },
        animationDuration: 500,
        animationEasing: 'cubicOut',
      },
    ],
  }
  return option
}
