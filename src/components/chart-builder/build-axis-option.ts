import { ChartType } from './chart-types'
import { getThemeColors } from './get-theme-colors'

type BuildAxisArgs = {
  type: ChartType
  xAxis: string
  yAxis: string
  data: any[]
  isDark: boolean
}

export const buildAxisOption = ({ type, xAxis, yAxis, data, isDark }: BuildAxisArgs): any => {
  if (!xAxis || !yAxis || !Array.isArray(data) || data.length === 0) return {}

  const xData = [...new Set(data.map((r: any) => String(r?.[xAxis])))]
    .slice(0, 50)
    .filter(Boolean)

  const yData = xData.map((x: string) => {
    const vals = data
      .filter((r: any) => String(r?.[xAxis]) === x)
      .map((r: any) => Number(r?.[yAxis]))
      .filter((v: number) => !Number.isNaN(v))

    if (vals.length === 0) return 0
    const sum = vals.reduce((a, b) => a + b, 0)
    return sum / vals.length
  })

  const colors = getThemeColors(isDark)

  const baseOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: colors.bgColor,
      borderColor: colors.borderColor,
      textStyle: { color: colors.textColor, fontSize: 13 },
      axisPointer: { type: 'shadow', shadowStyle: { color: 'rgba(0,0,0,0.1)' } },
      borderWidth: 1,
      padding: [10, 15],
      transitionDuration: 0.3,
    },
    legend: {
      data: [yAxis],
      textStyle: { color: colors.textColor, fontSize: 13, fontWeight: 500 },
      icon: 'rect',
      top: 15,
      padding: [0, 0],
    },
    grid: {
      left: 70,
      right: 40,
      top: 60,
      bottom: 60,
      containLabel: true,
      borderColor: colors.gridColor,
      show: true,
      backgroundColor: 'transparent',
    },
    xAxis: {
      type: 'category',
      data: xData,
      axisLabel: { color: colors.textColor, fontSize: 12, interval: 'auto', margin: 8 },
      axisLine: { lineStyle: { color: colors.gridColor, width: 1.5 } },
      axisTick: { lineStyle: { color: colors.gridColor } },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: colors.textColor, fontSize: 12, margin: 8 },
      axisLine: { lineStyle: { color: colors.gridColor, width: 1.5 } },
      splitLine: { lineStyle: { color: colors.gridColor, type: 'dashed', width: 0.8 } },
    },
  }

  if (type === 'bar') {
    return {
      ...baseOption,
      series: [
        {
          name: yAxis,
          data: yData,
          type: 'bar',
          itemStyle: {
            color: {
              type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: colors.gradientStart },
                { offset: 1, color: colors.gradientEnd },
              ],
            },
            borderRadius: [10, 10, 0, 0],
            opacity: 0.88,
            shadowColor: 'rgba(0,0,0,0.15)',
            shadowBlur: 8,
            shadowOffsetY: 4,
          },
          barWidth: '45%',
          barGap: '20%',
          barCategoryGap: '30%',
          label: {
            show: false,
            color: colors.textColor,
            fontSize: 11,
            position: 'top',
            distance: 5,
          },
          emphasis: {
            itemStyle: {
              opacity: 1,
              shadowColor: colors.gradientStart,
              shadowBlur: 15,
              shadowOffsetY: 6,
            },
          },
          animationDuration: 500,
          animationEasing: 'cubicOut',
        },
      ],
    }
  }

  if (type === 'line') {
    return {
      ...baseOption,
      series: [
        {
          name: yAxis,
          data: yData,
          type: 'line',
          smooth: 0.35,
          symbolSize: 8,
          itemStyle: {
            color: colors.gradientStart,
            borderColor: '#fff',
            borderWidth: 2,
            shadowColor: 'rgba(0,0,0,0.2)',
            shadowBlur: 6,
          },
          lineStyle: {
            width: 3.5,
            color: colors.gradientStart,
            shadowColor: 'rgba(0,0,0,0.1)',
            shadowBlur: 8,
            shadowOffsetY: 2,
          },
          areaStyle: { color: colors.primaryLight, origin: 'start' },
          emphasis: {
            focus: 'series',
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 3,
              shadowBlur: 12,
              shadowColor: colors.gradientStart,
              shadowOffsetY: 4,
            },
            lineStyle: { width: 4.5 },
          },
          animationDuration: 500,
          animationEasing: 'cubicOut',
        },
      ],
    }
  }

  return baseOption
}
