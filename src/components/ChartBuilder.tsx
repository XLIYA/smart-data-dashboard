// src/components/ChartBuilder.tsx
import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import Modal from './ui/Modal'
import Button from './ui/Button'
import Select from './ui/Select'
import { initChart } from '@/lib/echarts'
import { BarChart3, TrendingUp, Zap } from 'lucide-react'

type ChartType = 'bar' | 'line' | 'scatter'

interface ChartConfig {
  option: any
  type: ChartType
  xAxis: string
  yAxis: string
}

export default function ChartBuilder({
  open,
  onClose,
  data,
  columns,
  onAdd
}: {
  open: boolean
  onClose: () => void
  data: any[]
  columns: any[]
  onAdd: (cfg: ChartConfig) => void
}) {
  const [type, setType] = useState<ChartType>('bar')
  const [xAxis, setXAxis] = useState<string>('')
  const [yAxis, setYAxis] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<any>(null)
  const isDarkRef = useRef(false)

  const allColumns = useMemo(() => {
    return Array.isArray(columns) ? columns.filter(c => c?.name) : []
  }, [columns])

  const numCols = useMemo(() => {
    return allColumns.filter((c: any) => c?.type === 'number')
  }, [allColumns])

  // Monitor dark mode changes
  useEffect(() => {
    isDarkRef.current = document.documentElement.classList.contains('dark')
    const observer = new MutationObserver(() => {
      isDarkRef.current = document.documentElement.classList.contains('dark')
    })
    observer.observe(document.documentElement, { attributes: true })
    return () => observer.disconnect()
  }, [])

  // Auto-select first columns on modal open
  useEffect(() => {
    if (open && allColumns.length > 0) {
      if (!xAxis) setXAxis(allColumns[0].name)
      if (!yAxis && numCols.length > 0) setYAxis(numCols[0].name)
    }
  }, [open, allColumns, numCols, xAxis, yAxis])

  // Cleanup chart on unmount
  useEffect(() => {
    return () => {
      if (chartInstance.current) {
        try {
          chartInstance.current.dispose()
          chartInstance.current = null
        } catch (error) {
          console.warn('Error disposing chart:', error)
        }
      }
    }
  }, [])

  const buildOption = useCallback((): any => {
    try {
      if (!xAxis || !yAxis || data.length === 0) return {}
      return type === 'scatter' ? buildScatterOption() : buildAxisOption()
    } catch (error) {
      console.error('Chart build error:', error)
      return {}
    }
  }, [type, xAxis, yAxis, data])

  const getThemeColors = () => {
    const isDark = isDarkRef.current
    return {
      textColor: isDark ? '#f3f4f6' : '#374151',
      gridColor: isDark ? '#4b5563' : '#e5e7eb',
      bgColor: isDark ? '#1f2937' : '#fff',
      borderColor: isDark ? '#374151' : '#e5e7eb',
      primaryColor: isDark ? '#22d3ee' : '#0891b2',
      primaryLight: isDark ? 'rgba(34, 211, 238, 0.15)' : 'rgba(8, 145, 178, 0.1)',
      gradientStart: '#06b6d4',
      gradientEnd: '#0d9488'
    }
  }

  const buildAxisOption = () => {
    const xData = [...new Set(data.map((r: any) => String(r[xAxis])))]
      .slice(0, 50)
      .filter(Boolean)

    const yData = xData.map((x: any) => {
      const vals = data
        .filter((r: any) => String(r[xAxis]) === x)
        .map((r: any) => {
          const val = Number(r[yAxis])
          return isNaN(val) ? 0 : val
        })
      return vals.length > 0 ? vals.reduce((a, b) => a + b) / vals.length : 0
    })

    const colors = getThemeColors()

    const baseOption = {
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
        data: [yAxis],
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
        containLabel: true,
        borderColor: colors.gridColor,
        show: true,
        backgroundColor: 'transparent'
      },
      xAxis: {
        type: 'category',
        data: xData,
        axisLabel: {
          color: colors.textColor,
          fontSize: 12,
          interval: 'auto',
          margin: 8
        },
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
    } else if (type === 'line') {
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
              shadowBlur: 6
            },
            lineStyle: {
              width: 3.5,
              color: colors.gradientStart,
              shadowColor: 'rgba(0,0,0,0.1)',
              shadowBlur: 8,
              shadowOffsetY: 2
            },
            areaStyle: {
              color: colors.primaryLight,
              origin: 'start'
            },
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
    }

    return baseOption
  }

  const buildScatterOption = () => {
    const scatterData = data
      .slice(0, 200)
      .map((r: any) => [Number(r[xAxis]) || 0, Number(r[yAxis]) || 0])
      .filter(([x, y]) => !isNaN(x) && !isNaN(y))

    const colors = getThemeColors()

    return {
      tooltip: {
        trigger: 'item',
        backgroundColor: colors.bgColor,
        borderColor: colors.borderColor,
        textStyle: { color: colors.textColor, fontSize: 13 },
        formatter: (params: any) =>
          `<strong>${yAxis}</strong><br/>X: ${params.value[0].toFixed(2)}<br/>Y: ${params.value[1].toFixed(2)}`,
        borderWidth: 1,
        padding: [10, 15]
      },
      legend: {
        data: [yAxis],
        textStyle: { color: colors.textColor, fontSize: 13 },
        top: 15
      },
      grid: {
        left: 70,
        right: 40,
        top: 60,
        bottom: 60,
        containLabel: true,
        borderColor: colors.gridColor,
        show: true
      },
      xAxis: {
        type: 'value',
        axisLabel: { color: colors.textColor, fontSize: 12, margin: 8 },
        axisLine: { lineStyle: { color: colors.gridColor, width: 1.5 } },
        splitLine: { lineStyle: { color: colors.gridColor, type: 'dashed', width: 0.8 } }
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: colors.textColor, fontSize: 12, margin: 8 },
        axisLine: { lineStyle: { color: colors.gridColor, width: 1.5 } },
        splitLine: { lineStyle: { color: colors.gridColor, type: 'dashed', width: 0.8 } }
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
            shadowBlur: 6
          },
          emphasis: {
            itemStyle: {
              color: colors.gradientStart,
              opacity: 1,
              borderColor: '#fff',
              borderWidth: 3,
              shadowBlur: 12,
              shadowColor: colors.gradientStart
            }
          },
          animationDuration: 300
        }
      ]
    }
  }

  // Update chart
  useEffect(() => {
    if (!open || !chartRef.current || data.length === 0) return

    setIsLoading(true)

    const timer = requestAnimationFrame(() => {
      try {
        if (!chartInstance.current && chartRef.current) {
          chartInstance.current = initChart(chartRef.current)
          window.addEventListener('resize', () => {
            chartInstance.current?.resize()
          })
        }

        if (chartInstance.current) {
          const option = buildOption()
          if (Object.keys(option).length > 0) {
            chartInstance.current.setOption(option, { notMerge: true, lazyUpdate: false })
          }
        }
      } catch (error) {
        console.error('Error updating chart:', error)
      } finally {
        setIsLoading(false)
      }
    })

    return () => cancelAnimationFrame(timer)
  }, [type, xAxis, yAxis, open, data, buildOption])

  const handleAdd = () => {
    if (!xAxis) {
      alert('Please select X column')
      return
    }

    if (!yAxis) {
      alert('Please select Y column')
      return
    }

    onAdd({
      option: buildOption(),
      type,
      xAxis,
      yAxis
    })

    onClose()
    setType('bar')
    setXAxis('')
    setYAxis('')
  }

  if (!open) return null

  return (
    <Modal open={open} onClose={onClose} title="📊 Create New Chart">
      <div className="space-y-5 max-w-3xl">
        {/* Empty Data Warning */}
        {allColumns.length === 0 && (
          <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-700/50 rounded-lg flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <span className="text-sm font-medium text-amber-900 dark:text-amber-200">
              No data available. Please upload a CSV or Excel file first.
            </span>
          </div>
        )}

        {/* Chart Type Selection */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-900 dark:text-white">Chart Type</span>
            <span className="text-xs px-2 py-1 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 rounded-full">
              Choose one
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'bar' as ChartType, label: 'Bar Chart', icon: BarChart3, desc: 'Compare values' },
              { value: 'line' as ChartType, label: 'Line Chart', icon: TrendingUp, desc: 'Show trends' },
              { value: 'scatter' as ChartType, label: 'Scatter Plot', icon: Zap, desc: 'Correlations' }
            ].map(({ value, label, icon: Icon, desc }) => (
              <button
                key={value}
                onClick={() => setType(value)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                  type === value
                    ? 'border-cyan-500 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-500/15 dark:to-blue-500/15 shadow-md'
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <Icon size={20} className={type === value ? 'text-cyan-600 dark:text-cyan-300' : 'text-gray-600 dark:text-gray-400'} />
                  <span className={`text-xs font-semibold ${type === value ? 'text-cyan-700 dark:text-cyan-300' : 'text-gray-700 dark:text-gray-300'}`}>
                    {label}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{desc}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* X Axis Selection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-gray-900 dark:text-white">
              Horizontal Axis (X)
            </label>
            {xAxis && <span className="text-xs text-cyan-600 dark:text-cyan-400 font-medium">✓ Selected</span>}
          </div>
          {allColumns.length === 0 ? (
            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm text-gray-600 dark:text-gray-400">
              No columns available
            </div>
          ) : (
            <Select
              value={xAxis}
              onChange={(e) => setXAxis(e.target.value)}
              className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            >
              <option value="">Choose a column...</option>
              {allColumns.map((c: any) => (
                <option key={c?.name} value={c?.name}>
                  {c?.name} {c?.type && `• ${c.type}`}
                </option>
              ))}
            </Select>
          )}
        </div>

        {/* Y Axis Selection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-gray-900 dark:text-white">
              Vertical Axis (Y)
            </label>
            {yAxis && <span className="text-xs text-cyan-600 dark:text-cyan-400 font-medium">✓ Selected</span>}
          </div>
          {numCols.length === 0 ? (
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-lg text-sm text-amber-700 dark:text-amber-300">
              No numeric columns found. Add numeric data to continue.
            </div>
          ) : (
            <Select
              value={yAxis}
              onChange={(e) => setYAxis(e.target.value)}
              className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            >
              <option value="">Choose a column...</option>
              {numCols.map((c: any) => (
                <option key={c?.name} value={c?.name}>
                  {c?.name}
                </option>
              ))}
            </Select>
          )}
        </div>

        {/* Chart Preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-gray-900 dark:text-white">
              Live Preview
            </label>
            <div className="flex items-center gap-2">
              {isLoading && (
                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                  Rendering...
                </div>
              )}
              {!isLoading && xAxis && yAxis && (
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">✓ Ready</span>
              )}
            </div>
          </div>
          <div
            ref={chartRef}
            className="w-full h-96 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-lg transition-all"
          />
        </div>

        {/* Data Statistics */}
        {data.length > 0 && (
          <div className="grid grid-cols-2 gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-700/50 rounded-lg">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-300">Total Rows</span>
              <span className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                {data.length.toLocaleString()}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-300">Total Columns</span>
              <span className="text-2xl font-bold text-cyan-700 dark:text-cyan-400">
                {allColumns.length}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
          >
            Cancel
          </button>
          <Button
            onClick={handleAdd}
            disabled={!xAxis || !yAxis || data.length === 0 || isLoading}
            className="px-6 py-2.5 font-medium"
          >
            {isLoading ? 'Processing...' : '✓ Add Chart'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}