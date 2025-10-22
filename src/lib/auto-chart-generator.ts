// src/lib/auto-chart-generator.ts
import type { ColumnMeta } from '@/stores/dataStore'
import type { ChartEntry } from '@/stores/chartStore'
import { buildAxisOption } from '@/components/chart-builder/build-axis-option'
import { buildScatterOption } from '@/components/chart-builder/build-scatter-option'
import { buildPieOption } from '@/components/chart-builder/build-pie-option'

interface AutoChartConfig {
  data: any[]
  columns: ColumnMeta[]
  isDark: boolean
}

export const generateAutoCharts = ({
  data,
  columns,
  isDark,
}: AutoChartConfig): Omit<ChartEntry, 'id'>[] => {
  if (!data.length || !columns.length) return []

  const numberColumns = columns.filter((c) => c.type === 'number')
  const stringColumns = columns.filter((c) => c.type === 'string')

  const charts: Omit<ChartEntry, 'id'>[] = []

  // Chart 1: Bar Chart - First string + first numeric
  if (stringColumns.length > 0 && numberColumns.length > 0) {
    const xAxis = stringColumns[0].name
    const yAxis = numberColumns[0].name
    charts.push({
      type: 'bar',
      xAxis,
      yAxis,
      title: `${yAxis} by ${xAxis}`,
      showGrid: true,
      showLegend: true,
      colorScheme: 'default',
      option: buildAxisOption({
        type: 'bar',
        xAxis,
        yAxis,
        data,
        isDark,
        showGrid: true,
        showLegend: true,
        colorScheme: 'default',
        title: `${yAxis} by ${xAxis}`,
      }),
    })
  }

  // Chart 2: Line Chart - Trend over time
  if (stringColumns.length > 0 && numberColumns.length > 1) {
    const xAxis = stringColumns[0].name
    const yAxis = numberColumns[1].name
    charts.push({
      type: 'line',
      xAxis,
      yAxis,
      title: `${yAxis} Trend`,
      showGrid: true,
      showLegend: true,
      colorScheme: 'cool',
      option: buildAxisOption({
        type: 'line',
        xAxis,
        yAxis,
        data,
        isDark,
        showGrid: true,
        showLegend: true,
        colorScheme: 'cool',
        title: `${yAxis} Trend`,
      }),
    })
  }

  // Chart 3: Scatter Plot - Relationship between two numeric columns
  if (numberColumns.length >= 2) {
    const xAxis = numberColumns[0].name
    const yAxis = numberColumns[1].name
    charts.push({
      type: 'scatter',
      xAxis,
      yAxis,
      title: `${xAxis} vs ${yAxis}`,
      showGrid: true,
      showLegend: false,
      colorScheme: 'vibrant',
      option: buildScatterOption({
        xAxis,
        yAxis,
        data,
        isDark,
        showGrid: true,
        colorScheme: 'vibrant',
        title: `${xAxis} vs ${yAxis}`,
      }),
    })
  }

  // Chart 4: Pie Chart - Distribution
  if (stringColumns.length > 0 && numberColumns.length > 0) {
    const xAxis = stringColumns[0].name
    const yAxis = numberColumns[0].name
    charts.push({
      type: 'pie',
      xAxis,
      yAxis,
      title: `${yAxis} Distribution by ${xAxis}`,
      showGrid: false,
      showLegend: true,
      colorScheme: 'warm',
      option: buildPieOption({
        xAxis,
        yAxis,
        data,
        isDark,
        showLegend: true,
        colorScheme: 'warm',
        title: `${yAxis} Distribution by ${xAxis}`,
      }),
    })
  }

  return charts.slice(0, 4)
}