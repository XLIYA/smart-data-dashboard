// src/components/chart-builder/chart-builder.tsx
import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '../ui/Select' // اگر فایل‌تان ui/select.tsx است مسیر را به ../ui/select تغییر بدهید
import { initChart } from '@/lib/echarts'
import { BarChart3, TrendingUp, Zap, CheckCircle } from 'lucide-react'
import { ChartBuilderProps, ChartConfig, ChartType } from './chart-types'
import { useDarkModeRef } from './use-dark-mode-ref'
import { buildAxisOption } from './build-axis-option'
import { buildScatterOption } from './build-scatter-option'

const ChartBuilder = ({ open, onClose, data, columns, onAdd }: ChartBuilderProps) => {
  const [type, setType] = useState<ChartType>('bar')
  const [xAxis, setXAxis] = useState<string>('')
  const [yAxis, setYAxis] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<any>(null)
  const isDarkRef = useDarkModeRef()

  const allColumns = useMemo(
    () => (Array.isArray(columns) ? columns.filter((c) => c?.name) : []),
    [columns]
  )
  const numCols = useMemo(
    () => allColumns.filter((c: any) => c?.type === 'number'),
    [allColumns]
  )

  // انتخاب خودکار اولیه هنگام باز شدن مودال
  useEffect(() => {
    if (!open || allColumns.length === 0) return
    if (!xAxis) setXAxis(allColumns[0].name)
    if (!yAxis && numCols.length > 0) setYAxis(numCols[0].name)
  }, [open, allColumns, numCols])

  // پاکسازی اینستنس چارت
  useEffect(
    () => () => {
      try {
        chartInstance.current?.dispose?.()
        chartInstance.current = null
      } catch {}
    },
    []
  )

  const buildOption = useCallback((): any => {
    try {
      if (!xAxis || !yAxis || !Array.isArray(data) || data.length === 0) return {}
      const isDark = isDarkRef.current
      return type === 'scatter'
        ? buildScatterOption({ xAxis, yAxis, data, isDark })
        : buildAxisOption({ type, xAxis, yAxis, data, isDark })
    } catch (err) {
      console.error('Chart build error:', err)
      return {}
    }
  }, [type, xAxis, yAxis, data, isDarkRef])

  // رندر و ریسایز پایدار داخل مودال (ResizeObserver + rAF)
  useEffect(() => {
    if (!open || !chartRef.current || !Array.isArray(data) || data.length === 0) return
    setIsLoading(true)

    const el = chartRef.current
    let disposed = false

    const ensureInit = () => {
      if (!chartInstance.current) {
        chartInstance.current = initChart(el)
      }
    }

    const render = () => {
      if (!chartInstance.current) return
      const option = buildOption()
      if (option && Object.keys(option).length > 0) {
        chartInstance.current.clear()
        chartInstance.current.setOption(option, { notMerge: true, lazyUpdate: false })
        chartInstance.current.resize()
      }
    }

    // init بعد از اینکه DOM اندازه گرفت
    const raf = requestAnimationFrame(() => {
      ensureInit()
      render()
      setIsLoading(false)
    })

    // واکنش به تغییر اندازه واقعی کانتینر
    const ro = new ResizeObserver(() => {
      if (!disposed) {
        ensureInit()
        chartInstance.current?.resize()
      }
    })
    ro.observe(el)

    const onResize = () => chartInstance.current?.resize()
    window.addEventListener('resize', onResize)

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      ro.disconnect()
    }
  }, [open, data, xAxis, yAxis, type, buildOption])

  const handleAdd = useCallback(() => {
    if (!xAxis) {
      setError('Please select the X axis.')
      return
    }
    if (!yAxis) {
      setError('Please select the Y axis.')
      return
    }

    setError('')
    const cfg: ChartConfig = { option: buildOption(), type, xAxis, yAxis }
    onAdd(cfg)
    onClose()
    setType('bar')
    setXAxis('')
    setYAxis('')
  }, [xAxis, yAxis, type, onAdd, onClose, buildOption])

  if (!open) return null

  return (
    <Modal open={open} onClose={onClose} title="Create New Chart">
      {/* ظرف اسکرول مودال با اسکرول‌بار تم‌محور */}
      <div className="space-y-5 max-w-3xl max-h-[70vh] overflow-auto pr-1 scrollbar">
        {/* اخطار نبود داده */}
        {allColumns.length === 0 && (
          <div className="p-4 border rounded-lg border-amber-200 dark:border-amber-700/50 bg-amber-50/70 dark:bg-amber-900/20 text-sm">
            No data available. Please upload a CSV or Excel file first.
          </div>
        )}

        {/* انتخاب نوع چارت */}
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
              { value: 'scatter' as ChartType, label: 'Scatter Plot', icon: Zap, desc: 'Correlations' },
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
                  <Icon
                    size={20}
                    className={
                      type === value ? 'text-cyan-600 dark:text-cyan-300' : 'text-gray-600 dark:text-gray-400'
                    }
                  />
                  <span
                    className={`text-xs font-semibold ${
                      type === value ? 'text-cyan-700 dark:text-cyan-300' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {label}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{desc}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* X Axis */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-gray-900 dark:text-white">Horizontal Axis (X)</label>
            {xAxis && (
              <span className="text-xs text-cyan-600 dark:text-cyan-400 font-medium flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Selected
              </span>
            )}
          </div>
          {allColumns.length === 0 ? (
            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm text-gray-600 dark:text-gray-400">
              No columns available
            </div>
          ) : (
            <Select value={xAxis} onValueChange={(v) => setXAxis(v)}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Choose a column..." />
              </SelectTrigger>
              <SelectContent>
                {allColumns.map((c: any) => (
                  <SelectItem key={c?.name} value={c?.name}>
                    {c?.name}
                    {c?.type ? ` • ${c.type}` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Y Axis */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-gray-900 dark:text-white">Vertical Axis (Y)</label>
            {yAxis && (
              <span className="text-xs text-cyan-600 dark:text-cyan-400 font-medium flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Selected
              </span>
            )}
          </div>
          {numCols.length === 0 ? (
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-lg text-sm text-amber-700 dark:text-amber-300">
              No numeric columns found. Add numeric data to continue.
            </div>
          ) : (
            <Select value={yAxis} onValueChange={(v) => setYAxis(v)}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Choose a column..." />
              </SelectTrigger>
              <SelectContent>
                {numCols.map((c: any) => (
                  <SelectItem key={c?.name} value={c?.name}>
                    {c?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Live Preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-gray-900 dark:text-white">Live Preview</label>
            <div className="text-xs">
              {isLoading ? (
                <span className="text-gray-500 dark:text-gray-400">Rendering…</span>
              ) : xAxis && yAxis ? (
                <span className="text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Ready
                </span>
              ) : null}
            </div>
          </div>
          <div
            ref={chartRef}
            className="w-full h-96 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-lg transition-all"
          />
        </div>

        {/* خطای فرم (بدون alert) */}
        {error && <div className="text-xs text-red-600 dark:text-red-400">{error}</div>}

        {/* عملیات */}
        <div className="flex justify-end gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
          >
            Cancel
          </button>
          <Button
            onClick={handleAdd}
            disabled={!xAxis || !yAxis || !Array.isArray(data) || data.length === 0 || isLoading}
            className="px-6 py-2.5 font-medium"
          >
            Add Chart
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default ChartBuilder
