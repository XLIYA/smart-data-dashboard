// src/components/chart-builder/build-scatter-option.ts
import type { EChartsOption } from '@/lib/echarts'
import { getThemeColors, getColorScheme } from './get-theme-colors'
import type { DataSet } from '@/types/data'
import type { ColorScheme } from './chart-types'

export interface BuildScatterArgsXY {
  xAxis: string
  yAxis: string
  data: DataSet
  isDark: boolean
  showGrid?: boolean
  colorScheme?: ColorScheme
  title?: string
}

export function buildScatterOption({ 
  xAxis, 
  yAxis, 
  data, 
  isDark,
  showGrid = true,
  colorScheme = 'default',
  title = ''
}: BuildScatterArgsXY): EChartsOption {
  const colors = getThemeColors(isDark)
  const scheme = getColorScheme(colorScheme, isDark)

  const points: [number, number][] = data.map((row) => {
    const xv = row?.[xAxis] as any
    const yv = row?.[yAxis] as any
    const xnum = typeof xv === 'number' ? xv : (xv instanceof Date ? xv.getTime() : Number(xv))
    const ynum = typeof yv === 'number' ? yv : (yv instanceof Date ? yv.getTime() : Number(yv))
    return [Number.isFinite(xnum) ? xnum : 0, Number.isFinite(ynum) ? ynum : 0]
  })

  const option: EChartsOption = {
    backgroundColor: 'transparent',
    grid: { 
      left: 60, 
      right: 30, 
      top: title ? 60 : 40, 
      bottom: 60, 
      containLabel: true 
    },
    textStyle: { color: colors.textColor, fontFamily: 'inherit' },

    // Title
    ...(title && {
      title: {
        text: title,
        left: 'center',
        top: 10,
        textStyle: {
          color: colors.textColor,
          fontSize: 16,
          fontWeight: 600,
        },
      },
    }),

    tooltip: {
      trigger: 'item',
      backgroundColor: isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      borderColor: colors.borderColor,
      borderWidth: 1,
      textStyle: { color: colors.textColor },
      padding: [10, 15],
      formatter: (p: any) => {
        const [x, y] = p.value as number[]
        return `
          <div style="font-weight: 600; margin-bottom: 8px;">Data Point</div>
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span>${xAxis}:</span>
              <strong>${x.toLocaleString()}</strong>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span>${yAxis}:</span>
              <strong>${y.toLocaleString()}</strong>
            </div>
          </div>
        `
      },
    },

    xAxis: {
      type: 'value',
      name: xAxis,
      nameLocation: 'middle',
      nameGap: 35,
      nameTextStyle: {
        color: colors.textColor,
        fontSize: 12,
        fontWeight: 600,
      },
      axisLine: { 
        show: true,
        lineStyle: { color: colors.borderColor, width: 2 } 
      },
      axisTick: { show: true, lineStyle: { color: colors.borderColor } },
      axisLabel: { 
        color: colors.textColor,
        fontSize: 11,
        formatter: (value: number) => {
          if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
          if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
          return value.toLocaleString()
        }
      },
      splitLine: { 
        show: showGrid, 
        lineStyle: { 
          color: colors.gridColor,
          type: 'dashed',
          opacity: 0.6
        } 
      },
    },

    yAxis: {
      type: 'value',
      name: yAxis,
      nameLocation: 'middle',
      nameGap: 50,
      nameTextStyle: {
        color: colors.textColor,
        fontSize: 12,
        fontWeight: 600,
      },
      axisLine: { 
        show: true,
        lineStyle: { color: colors.borderColor, width: 2 } 
      },
      axisTick: { show: true, lineStyle: { color: colors.borderColor } },
      axisLabel: { 
        color: colors.textColor,
        fontSize: 11,
        formatter: (value: number) => {
          if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
          if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
          return value.toLocaleString()
        }
      },
      splitLine: { 
        show: showGrid, 
        lineStyle: { 
          color: colors.gridColor,
          type: 'dashed',
          opacity: 0.6
        } 
      },
    },

    series: [
      {
        type: 'scatter',
        data: points,
        symbolSize: 10,
        itemStyle: {
          color: scheme.primary,
          borderColor: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.8)',
          borderWidth: 2,
          shadowBlur: 8,
          shadowColor: scheme.shadow,
          shadowOffsetX: 0,
          shadowOffsetY: 2,
        },
        emphasis: {
          focus: 'series',
          itemStyle: {
            shadowBlur: 15,
            shadowColor: scheme.shadow,
            borderWidth: 3,
          },
          scale: 1.3,
        },
        animationDuration: 600,
        animationEasing: 'elasticOut',
      },
    ],
  }
  
  return option
}