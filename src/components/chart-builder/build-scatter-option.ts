import { getThemeColors } from './get-theme-colors'

type BuildScatterArgs = {
  xAxis: string
  yAxis: string
  data: any[]
  isDark: boolean
}

export const buildScatterOption = ({ xAxis, yAxis, data, isDark }: BuildScatterArgs): any => {
  if (!xAxis || !yAxis || !Array.isArray(data) || data.length === 0) return {}

  const scatterData = data
    .slice(0, 200)
    .map((r: any) => [Number(r?.[xAxis]) || 0, Number(r?.[yAxis]) || 0])
    .filter(([x, y]) => !Number.isNaN(x) && !Number.isNaN(y))

  const colors = getThemeColors(isDark)

  return {
    tooltip: {
      trigger: 'item',
      backgroundColor: colors.bgColor,
      borderColor: colors.borderColor,
      textStyle: { color: colors.textColor, fontSize: 13 },
      formatter: (p: any) =>
        `<strong>${yAxis}</strong><br/>X: ${p.value[0].toFixed(2)}<br/>Y: ${p.value[1].toFixed(2)}`,
      borderWidth: 1,
      padding: [10, 15],
    },
    legend: {
      data: [yAxis],
      textStyle: { color: colors.textColor, fontSize: 13 },
      top: 15,
    },
    grid: {
      left: 70, right: 40, top: 60, bottom: 60,
      containLabel: true, borderColor: colors.gridColor, show: true,
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
        data: scatterData,
        type: 'scatter',
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
}
