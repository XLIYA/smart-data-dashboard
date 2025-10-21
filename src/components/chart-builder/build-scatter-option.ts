// src/components/chart-builder/build-scatter-option.ts
import type { EChartsOption } from '@/lib/echarts'
import { getThemeColors } from './get-theme-colors'
import type { DataSet } from '@/types/data'

export interface BuildScatterArgsXY {
  xAxis: string
  yAxis: string
  data: DataSet
  isDark: boolean
}

// ...
export function buildScatterOption({ xAxis, yAxis, data, isDark }: BuildScatterArgsXY): EChartsOption {
  const colors = getThemeColors(isDark)

  const points: [number, number][] = data.map((row) => {
    const xv = row?.[xAxis] as any
    const yv = row?.[yAxis] as any
    const xnum = typeof xv === 'number' ? xv : (xv instanceof Date ? xv.getTime() : Number(xv))
    const ynum = typeof yv === 'number' ? yv : (yv instanceof Date ? yv.getTime() : Number(yv))
    return [Number.isFinite(xnum) ? xnum : 0, Number.isFinite(ynum) ? ynum : 0]
  })

  const option: EChartsOption = {
    backgroundColor: 'transparent', // ⬅️ مهم
    grid: { left: 48, right: 24, top: 32, bottom: 48, containLabel: true },
    textStyle: { color: colors.textColor },
    tooltip: {
      trigger: 'item',
      triggerOn: 'click',            // ⬅️ فقط با کلیک
      formatter: (p: any) => {
        const [x, y] = p.value as number[]
        return `${xAxis}: ${x}<br/>${yAxis}: ${y}`
      },
    },
    xAxis: {
      type: 'value',
      axisLabel: { color: colors.textColor },
      splitLine: { show: true, lineStyle: { color: colors.gridColor } },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: colors.textColor },
      splitLine: { show: true, lineStyle: { color: colors.gridColor } },
    },
    series: [
      {
        type: 'scatter',
        data: points,
        symbolSize: 8,
        itemStyle: {
          color: colors.primaryColor,
          borderColor: '#fff',
          borderWidth: 1,
          shadowBlur: 0,             // ⬅️ سایه حذف
        },
        emphasis: { disabled: true }, // ⬅️ Hover خاموش
        animationDuration: 300,
      },
    ],
  }
  return option
}
