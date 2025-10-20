import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Select from '../ui/Select'
import { initChart } from '@/lib/echarts'
import { BarChart3, TrendingUp, Zap } from 'lucide-react'

import { ChartBuilderProps, ChartConfig, ChartType } from './chart-types'
import { useDarkModeRef } from './use-dark-mode-ref'
import { buildAxisOption } from './build-axis-option'
import { buildScatterOption } from './build-scatter-option'

const ChartBuilder = ({
  open, onClose, data, columns, onAdd,
}: ChartBuilderProps) => {
  const [type, setType] = useState<ChartType>('bar')
  const [xAxis, setXAxis] = useState<string>('')
  const [yAxis, setYAxis] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<any>(null)
  const isDarkRef = useDarkModeRef()

  const allColumns = useMemo(
    () => (Array.isArray(columns) ? columns.filter((c) => c?.name) : []),
    [columns],
  )

  const numCols = useMemo(
    () => allColumns.filter((c: any) => c?.type === 'number'),
    [allColumns],
  )

  // Auto-select first columns on modal open
  useEffect(() => {
    if (!open || allColumns.length === 0) return
    if (!xAxis) setXAxis(allColumns[0].name)
    if (!yAxis && numCols.length > 0) setYAxis(numCols[0].name)
  }, [open, allColumns, numCols, xAxis, yAxis])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      try {
        chartInstance.current?.dispose?.()
        chartInstance.current = null
      } catch (e) {
        console.warn('Error disposing chart:', e)
      }
    }
  }, [])

  const buildOption = useCallback((): any => {
    try {
      if (!xAxis || !yAxis || data.length === 0) return {}
      const isDark = isDarkRef.current
      return type === 'scatter'
        ? buildScatterOption({ xAxis, yAxis, data, isDark })
        : buildAxisOption({ type, xAxis, yAxis, data, isDark })
    } catch (err) {
      console.error('Chart build error:', err)
      return {}
    }
  }, [type, xAxis, yAxis, data, isDarkRef])

  // Update chart
  useEffect(() => {
    if (!open || !chartRef.current || data.length === 0) return
    setIsLoading(true)

    const onResize = () => chartInstance.current?.resize?.()

    const timer = requestAnimationFrame(() => {
      try {
        if (!chartInstance.current && chartRef.current) {
          chartInstance.current = initChart(chartRef.current)
          window.addEventListener('resize', onResize)
        }
        const option = buildOption()
        if (chartInstance.current && Object.keys(option).length > 0) {
          chartInstance.current.setOption(option, { notMerge: true, lazyUpdate: false })
        }
      } catch (e) {
        console.error('Error updating chart:', e)
      } finally {
        setIsLoading(false)
      }
    })

    return () => {
      cancelAnimationFrame(timer)
      window.removeEventListener('resize', onResize)
    }
  }, [type, xAxis, yAxis, open, data, buildOption])

  const handleAdd = useCallback(() => {
    if (!xAxis) return alert('Please select X column')
    if (!yAxis) return alert('Please select Y column')

    const cfg: ChartConfig = { option: buildOption(), type, xAxis, yAxis }
    onAdd(cfg)

    onClose()
    setType('bar')
    setXAxis('')
    setYAxis('')
  }, [xAxis, yAxis, type, onAdd, onClose, buildOption])

  if (!open) return null

  return (
    <Modal open={open} onClose={onClose} title="📊 Create New Chart">
      <div className="space-y-5 max-w-3xl">

        {allColumns.length === 0 && (
          <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-700/50 rounded-lg flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <span className="text-sm font-medium text-amber-900 dark:text-amber-200">
              No data available. Please upload a CSV or Excel file first.
            </span>
          </div>
        )}

        {/* Chart Type */}
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

        {/* X Axis */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-gray-900 dark:text-white">Horizontal Axis (X)</label>
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

        {/* Y Axis */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-gray-900 dark:text-white">Vertical Axis (Y)</label>
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
                <option key={c?.name} value={c?.name}>{c?.name}</option>
              ))}
            </Select>
          )}
        </div>

        {/* Preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-gray-900 dark:text-white">Live Preview</label>
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

        {/* Stats */}
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

        {/* Actions */}
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

export default ChartBuilder
