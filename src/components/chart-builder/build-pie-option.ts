// src/components/chart-builder/build-pie-option.ts
import type { EChartsOption } from '@/lib/echarts'
import { getThemeColors, getColorScheme } from './get-theme-colors'
import type { DataSet } from '@/types/data'
import type { ColorScheme } from './chart-types'

export interface BuildPieArgsXY {
  xAxis: string
  yAxis: string
  data: DataSet
  isDark: boolean
  showLegend?: boolean
  colorScheme?: ColorScheme
  title?: string
}

export function buildPieOption({
  xAxis,
  yAxis,
  data,
  isDark,
  showLegend = true,
  colorScheme = 'default',
  title = '',
}: BuildPieArgsXY): EChartsOption {
  const colors = getThemeColors(isDark)
  const scheme = getColorScheme(colorScheme, isDark)

  // Aggregate data by category
  const aggregated = new Map<string, number>()
  data.forEach((row) => {
    const category = String(row?.[xAxis] || 'Unknown')
    const value = Number(row?.[yAxis]) || 0
    aggregated.set(category, (aggregated.get(category) || 0) + value)
  })

  const pieData = Array.from(aggregated.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10) // Top 10 categories

  const option: EChartsOption = {
    backgroundColor: 'transparent',
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
      formatter: (params: any) => {
        return `
          <div style="font-weight: 600; margin-bottom: 8px;">${params.name}</div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${params.color};"></span>
            <span>${yAxis}: <strong>${params.value.toLocaleString()}</strong></span>
          </div>
          <div style="margin-top: 4px; color: ${colors.textColor}; opacity: 0.7;">
            ${params.percent}% of total
          </div>
        `
      },
    },

    legend: {
      show: showLegend,
      orient: 'vertical',
      right: 20,
      top: 'center',
      textStyle: { 
        color: colors.textColor,
        fontSize: 11,
      },
      itemGap: 12,
      itemWidth: 14,
      itemHeight: 14,
      formatter: (name: string) => {
        const item = pieData.find(d => d.name === name)
        if (!item) return name
        const percent = ((item.value / pieData.reduce((sum, d) => sum + d.value, 0)) * 100).toFixed(1)
        return `${name} (${percent}%)`
      },
    },

    series: [
      {
        type: 'pie',
        radius: ['45%', '75%'],
        center: ['40%', '50%'],
        data: pieData,
        label: {
          show: !showLegend,
          position: 'outside',
          color: colors.textColor,
          fontSize: 11,
          fontWeight: 500,
          formatter: '{b}\n{d}%',
        },
        labelLine: {
          show: !showLegend,
          lineStyle: { color: colors.borderColor },
        },
        itemStyle: {
          borderColor: isDark ? '#1e293b' : '#ffffff',
          borderWidth: 3,
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.2)',
        },
        emphasis: {
          scale: true,  // ✅ باید boolean باشد نه number
          scaleSize: 10, // ✅ اندازه scale را اینجا تعریف کنید
          itemStyle: {
            shadowBlur: 20,
            shadowOffsetX: 0,
            shadowOffsetY: 4,
          },
        },
        animationDuration: 1000,
        animationEasing: 'cubicOut',
      },
    ],

    // Color palette based on scheme
    color: scheme.palette,
  }

  return option
}