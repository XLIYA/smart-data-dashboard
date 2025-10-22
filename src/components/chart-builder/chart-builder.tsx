// src/components/chart-builder/chart-builder.tsx
import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import type { ECharts } from '@/lib/echarts'
import { initChart } from '@/lib/echarts'

import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../ui/Select'

import { 
  BarChart3, 
  TrendingUp, 
  Zap, 
  CheckCircle, 
  PieChart, 
  Activity,
  Info,
  Sparkles,
  X
} from 'lucide-react'
import type { ChartBuilderProps, ChartConfig, ChartType } from './chart-types'
import { useDarkModeRef } from './use-dark-mode-ref'
import { buildAxisOption } from './build-axis-option'
import { buildScatterOption } from './build-scatter-option'
import { buildPieOption } from './build-pie-option'

const ChartBuilder = ({ open, onClose, data, columns, onAdd }: ChartBuilderProps) => {
  const [type, setType] = useState<ChartType>('bar')
  const [xAxis, setXAxis] = useState<string>('')
  const [yAxis, setYAxis] = useState<string>('')
  const [chartTitle, setChartTitle] = useState<string>('')
  const [showGrid, setShowGrid] = useState(true)
  const [showLegend, setShowLegend] = useState(true)
  const [colorScheme, setColorScheme] = useState<'default' | 'vibrant' | 'cool' | 'warm'>('default')

  const ref = useRef<HTMLDivElement | null>(null)
  const inst = useRef<ECharts | null>(null)

  // theme
  const isDarkRef = useDarkModeRef()
  const isDark = isDarkRef.current

  // مموری کردن ستون‌ها برای جلوگیری از re-render
  const numberColumns = useMemo(
    () => columns.filter((c) => c.type === 'number'),
    [columns]
  )

  const stringColumns = useMemo(
    () => columns.filter((c) => c.type === 'string'),
    [columns]
  )

  // تعیین ستون‌های مجاز برای X Axis بر اساس نوع چارت
  const xAxisColumns = useMemo(() => {
    if (type === 'pie') {
      // Pie فقط string columns
      return stringColumns
    } else if (type === 'scatter') {
      // Scatter فقط numeric columns
      return numberColumns
    } else {
      // Bar و Line می‌توانند همه را داشته باشند
      return columns
    }
  }, [type, stringColumns, numberColumns, columns])

  // Y Axis همیشه numeric
  const yAxisColumns = numberColumns

  // Chart type options
  const chartTypes = [
    { value: 'bar', label: 'Bar Chart', icon: BarChart3, description: 'Compare values across categories' },
    { value: 'line', label: 'Line Chart', icon: TrendingUp, description: 'Show trends over time' },
    { value: 'scatter', label: 'Scatter Plot', icon: Zap, description: 'Explore relationships between variables' },
    { value: 'pie', label: 'Pie Chart', icon: PieChart, description: 'Show proportions of a whole' },
  ] as const

  // Reset selections when modal opens or type changes
  useEffect(() => {
    if (open) {
      setXAxis('')
      setYAxis('')
      setChartTitle('')
      setType('bar')
      setShowGrid(true)
      setShowLegend(true)
      setColorScheme('default')
    }
  }, [open])

  // Reset axis when type changes
  useEffect(() => {
    setXAxis('')
    setYAxis('')
  }, [type])

  // init / dispose
  useEffect(() => {
    if (!open || !ref.current) return
    inst.current = initChart(ref.current)
    return () => {
      inst.current?.dispose()
      inst.current = null
    }
  }, [open])

  // live preview با debounce برای جلوگیری از lag
  useEffect(() => {
    if (!inst.current) return
    if (!xAxis || !yAxis) {
      inst.current.clear()
      return
    }

    // استفاده از setTimeout برای debounce
    const timer = setTimeout(() => {
      if (!inst.current) return

      let opt
      if (type === 'scatter') {
        opt = buildScatterOption({ 
          data, 
          xAxis, 
          yAxis, 
          isDark, 
          showGrid, 
          colorScheme,
          title: chartTitle 
        })
      } else if (type === 'pie') {
        opt = buildPieOption({ 
          data, 
          xAxis, 
          yAxis, 
          isDark, 
          showLegend,
          colorScheme,
          title: chartTitle 
        })
      } else {
        opt = buildAxisOption({ 
          data, 
          xAxis, 
          yAxis, 
          type, 
          isDark, 
          showGrid, 
          showLegend,
          colorScheme,
          title: chartTitle 
        })
      }

      inst.current.setOption(opt, true)
    }, 150) // 150ms debounce

    return () => clearTimeout(timer)
  }, [data, xAxis, yAxis, type, isDark, showGrid, showLegend, colorScheme, chartTitle])

  // add chart config
  const handleAdd = useCallback(() => {
    if (!xAxis || !yAxis) return

    let option
    if (type === 'scatter') {
      option = buildScatterOption({ 
        data, 
        xAxis, 
        yAxis, 
        isDark, 
        showGrid, 
        colorScheme,
        title: chartTitle 
      })
    } else if (type === 'pie') {
      option = buildPieOption({ 
        data, 
        xAxis, 
        yAxis, 
        isDark, 
        showLegend,
        colorScheme,
        title: chartTitle 
      })
    } else {
      option = buildAxisOption({ 
        data, 
        xAxis, 
        yAxis, 
        type, 
        isDark, 
        showGrid, 
        showLegend,
        colorScheme,
        title: chartTitle 
      })
    }

    const cfg: ChartConfig = { 
      type, 
      xAxis, 
      yAxis, 
      option,
      title: chartTitle || `${yAxis} by ${xAxis}`,
      showGrid,
      showLegend,
      colorScheme
    }
    onAdd(cfg)
    onClose()
  }, [type, xAxis, yAxis, isDark, data, onAdd, onClose, showGrid, showLegend, colorScheme, chartTitle])

  const isValid = xAxis && yAxis
  const canShowGrid = type !== 'pie'

  return (
    <Modal 
      open={open} 
      onClose={onClose} 
      title={
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-accent-500/20 to-cyan-500/20">
            <Sparkles className="w-5 h-5 text-accent-500" />
          </div>
          <div>
            <h3 className="text-base font-semibold">Chart Builder</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-normal">
              Create beautiful visualizations from your data
            </p>
          </div>
        </div>
      }
      maxWidth="max-w-5xl"
    >
      <div className="space-y-6">
        {/* Chart Type Selection - Cards (بدون hover effect) */}
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block">
            Choose Chart Type
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {chartTypes.map((ct) => {
              const Icon = ct.icon
              const isSelected = type === ct.value
              return (
                <button
                  key={ct.value}
                  onClick={() => setType(ct.value as ChartType)}
                  className={`
                    relative p-4 rounded-xl border-2 transition-colors duration-200
                    ${isSelected 
                      ? 'border-accent-500 bg-accent-500/10 shadow-lg shadow-accent-500/20' 
                      : 'border-gray-200 dark:border-white/10 bg-white dark:bg-gray-800/50'
                    }
                  `}
                  title={ct.description}
                >
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className={`
                      p-2.5 rounded-lg transition-colors
                      ${isSelected 
                        ? 'bg-accent-500 text-white' 
                        : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400'
                      }
                    `}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`
                      text-xs font-medium
                      ${isSelected 
                        ? 'text-accent-600 dark:text-accent-400' 
                        : 'text-gray-700 dark:text-gray-300'
                      }
                    `}>
                      {ct.label}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Axis Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* X Axis */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
              X Axis
              {type === 'pie' && (
                <span className="text-xs text-accent-500">(Categories)</span>
              )}
              {type === 'scatter' && (
                <span className="text-xs text-accent-500">(Numeric)</span>
              )}
            </label>
            <Select value={xAxis} onValueChange={setXAxis}>
              <SelectTrigger className="h-11 rounded-xl border-2 px-4">
                <SelectValue placeholder="Select X column" />
              </SelectTrigger>
              <SelectContent>
                {xAxisColumns.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    No suitable columns for {type} chart
                  </div>
                ) : (
                  xAxisColumns.map((c) => (
                    <SelectItem key={c.name} value={c.name}>
                      <div className="flex items-center gap-2">
                        <span className={`
                          inline-flex items-center rounded-md text-[10px] px-1.5 py-0.5 font-medium
                          ${c.type === 'number' 
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-300'
                          }
                        `}>
                          {c.type}
                        </span>
                        <span>{c.name}</span>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Y Axis */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
              Y Axis
              <span className="text-xs text-accent-500">(Numeric)</span>
            </label>
            <Select value={yAxis} onValueChange={setYAxis}>
              <SelectTrigger className="h-11 rounded-xl border-2 px-4">
                <SelectValue placeholder="Select Y column" />
              </SelectTrigger>
              <SelectContent>
                {yAxisColumns.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    No numeric columns available
                  </div>
                ) : (
                  yAxisColumns.map((c) => (
                    <SelectItem key={c.name} value={c.name}>
                      <div className="flex items-center gap-2">
                        <Activity className="w-3.5 h-3.5 text-blue-500" />
                        <span>{c.name}</span>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Chart Title */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
            Chart Title
            <span className="text-xs text-gray-500 dark:text-gray-400">(Optional)</span>
          </label>
          <input
            type="text"
            value={chartTitle}
            onChange={(e) => setChartTitle(e.target.value)}
            placeholder="Enter chart title..."
            className="w-full h-11 px-4 rounded-xl border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 
              focus:border-accent-400 focus:ring-2 focus:ring-accent-400/20 outline-none transition-all
              text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
        </div>

        {/* Advanced Options */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            <Info className="w-4 h-4 text-accent-500" />
            Advanced Options
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Color Scheme */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Color Scheme
              </label>
              <Select value={colorScheme} onValueChange={(v) => setColorScheme(v as any)}>
                <SelectTrigger className="h-9 rounded-lg border px-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500" />
                      Default
                    </div>
                  </SelectItem>
                  <SelectItem value="vibrant">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500" />
                      Vibrant
                    </div>
                  </SelectItem>
                  <SelectItem value="cool">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" />
                      Cool
                    </div>
                  </SelectItem>
                  <SelectItem value="warm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500" />
                      Warm
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Toggle Options */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Display Options
              </label>
              <div className="flex gap-2">
                {canShowGrid && (
                  <button
                    onClick={() => setShowGrid(!showGrid)}
                    className={`
                      flex-1 h-9 px-3 rounded-lg border-2 transition-colors text-xs font-medium
                      ${showGrid
                        ? 'border-accent-500 bg-accent-500/10 text-accent-600 dark:text-accent-400'
                        : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400'
                      }
                    `}
                  >
                    Grid
                  </button>
                )}
                <button
                  onClick={() => setShowLegend(!showLegend)}
                  className={`
                    flex-1 h-9 px-3 rounded-lg border-2 transition-colors text-xs font-medium
                    ${showLegend
                      ? 'border-accent-500 bg-accent-500/10 text-accent-600 dark:text-accent-400'
                      : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400'
                    }
                  `}
                >
                  Legend
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Activity className="w-4 h-4 text-accent-500" />
            Live Preview
          </label>
          <div className="relative rounded-xl border-2 border-gray-200 dark:border-white/10 overflow-hidden bg-white dark:bg-gray-900">
            {!isValid && (
              <div className="absolute inset-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center space-y-2 p-6">
                  <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center">
                    <Info className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Select both X and Y axes to preview chart
                  </p>
                </div>
              </div>
            )}
            <div ref={ref} className="h-[350px] w-full" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-gray-200 dark:border-white/10">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-gray-200 dark:border-white/10 
              text-gray-700 dark:text-gray-300 font-medium transition-colors"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
          <Button 
            onClick={handleAdd} 
            disabled={!isValid}
            className="flex items-center gap-2 px-6 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed
              shadow-lg shadow-accent-500/20 transition-all"
          >
            <CheckCircle className="w-4 h-4" />
            Add Chart
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default ChartBuilder