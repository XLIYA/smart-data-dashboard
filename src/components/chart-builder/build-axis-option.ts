// src/components/chart-builder/build-axis-option.ts
import type { EChartsOption } from '@/lib/echarts'
import { getThemeColors, getColorScheme } from './get-theme-colors'
import type { DataSet } from '@/types/data'
import type { ChartType, ColorScheme } from './chart-types'

export interface BuildAxisArgsXY {
  type: Exclude<ChartType, 'scatter' | 'pie'>
  xAxis: string
  yAxis: string
  data: DataSet
  isDark: boolean
  showGrid?: boolean
  showLegend?: boolean
  colorScheme?: ColorScheme
  title?: string
}

export function buildAxisOption({ 
  type, 
  xAxis, 
  yAxis, 
  data, 
  isDark, 
  showGrid = true,
  showLegend = true,
  colorScheme = 'default',
  title = ''
}: BuildAxisArgsXY): EChartsOption {
  const colors = getThemeColors(isDark)
  const scheme = getColorScheme(colorScheme, isDark)

  const xs: any[] = data.map((row) => row?.[xAxis])
  const ys: number[] = data.map((row) => {
    const v = row?.[yAxis]
    const n = typeof v === 'number' ? v : (v instanceof Date ? v.getTime() : Number(v))
    return Number.isFinite(n) ? n : 0
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

    // Tooltip - improved
    tooltip: {
      trigger: 'axis',
      backgroundColor: isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      borderColor: colors.borderColor,
      borderWidth: 1,
      textStyle: { color: colors.textColor },
      padding: [10, 15],
      axisPointer: { 
        type: 'shadow',
        shadowStyle: {
          color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
        }
      },
      formatter: (params: any) => {
        const p = Array.isArray(params) ? params[0] : params
        return `
          <div style="font-weight: 600; margin-bottom: 4px;">${p.name}</div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${scheme.primary};"></span>
            <span>${yAxis}: <strong>${p.value?.toLocaleString()}</strong></span>
          </div>
        `
      },
    },

    // Legend
    ...(showLegend && {
      legend: {
        show: true,
        top: title ? 35 : 15,
        left: 'center',
        textStyle: { color: colors.textColor },
        itemGap: 20,
      },
    }),

    xAxis: {
      type: 'category',
      data: xs,
      axisLine: { 
        show: true,
        lineStyle: { color: colors.borderColor, width: 2 } 
      },
      axisTick: { 
        show: true,
        alignWithLabel: true,
        lineStyle: { color: colors.borderColor }
      },
      axisLabel: { 
        color: colors.textColor,
        fontSize: 11,
        fontWeight: 500,
        interval: 'auto',
        rotate: xs.length > 10 ? 45 : 0,
      },
      splitLine: { show: false },
    },

    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { 
        color: colors.textColor,
        fontSize: 11,
        fontWeight: 500,
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
        name: yAxis,
        type,
        data: ys,
        smooth: type === 'line',
        showBackground: false,
        
        // Improved styling
        itemStyle: {
          color: scheme.gradient,
          borderRadius: type === 'bar' ? [6, 6, 0, 0] : 0,
          shadowBlur: 8,
          shadowColor: scheme.shadow,
          shadowOffsetY: 2,
        },
        
        // Line specific
        ...(type === 'line' && {
          lineStyle: { 
            width: 3,
            shadowBlur: 8,
            shadowColor: scheme.shadow,
            shadowOffsetY: 2,
          },
          areaStyle: {
            color: scheme.areaGradient,
            opacity: 0.3,
          },
          symbol: 'circle',
          symbolSize: 8,
        }),

        // Bar specific
        ...(type === 'bar' && {
          barWidth: '60%',
          barMaxWidth: 50,
        }),

        emphasis: {
          focus: 'series',
          itemStyle: {
            shadowBlur: 15,
            shadowColor: scheme.shadow,
          },
        },
        
        animationDuration: 800,
        animationEasing: 'cubicOut',
      },
    ],
  }
  
  return option
}