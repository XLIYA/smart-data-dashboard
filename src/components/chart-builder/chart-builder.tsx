// src/components/chart-builder/chart-builder.tsx
import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../ui/select'
import { initChart } from '@/lib/echarts'
import { BarChart3, TrendingUp, Zap, CheckCircle } from 'lucide-react'
import type { ChartType } from './chart-types'
import { useDarkModeRef } from './use-dark-mode-ref'

type ChartBuilderProps = {
  open: boolean
  onClose: () => void
  data: any[]
  columns: { name: string; type?: string }[]
  onAdd: (cfg: { type: ChartType; option: any }) => void
}

const getThemeColors = (isDark: boolean) => ({
  text: isDark ? '#e5e7eb' : '#111827',
  grid: isDark ? '#333' : '#e5e7eb',
})

const buildAxisOption = (args: { type: ChartType; xAxis: string; yAxis: string; data: any[]; isDark: boolean }) => {
  const { type, xAxis, yAxis, data, isDark } = args
  if (!xAxis || !yAxis || !Array.isArray(data) || data.length === 0) return {}
  const colors = getThemeColors(isDark)
  const xData = [...new Set(data.map((r: any) => String(r?.[xAxis] ?? '')))].slice(0, 200)
  const yData = xData.map(x =>
    Number.isFinite(+data.find((r: any) => String(r?.[xAxis] ?? '') === x)?.[yAxis])
      ? +data.find((r: any) => String(r?.[xAxis] ?? '') === x)?.[yAxis]
      : 0
  )
  return {
    tooltip: { trigger: 'axis' },
    grid: { left: 40, right: 20, top: 30, bottom: 40, containLabel: true },
    xAxis: { type: 'category', data: xData, axisLine: { lineStyle: { color: colors.grid } }, axisLabel: { color: colors.text } },
    yAxis: { type: 'value', axisLine: { lineStyle: { color: colors.grid } }, axisLabel: { color: colors.text }, splitLine: { lineStyle: { color: colors.grid } } },
    series: [{ type, data: yData, smooth: type === 'line' }],
  }
}

const buildScatterOption = (args: { xAxis: string; yAxis: string; data: any[]; isDark: boolean }) => {
  const { xAxis, yAxis, data, isDark } = args
  if (!xAxis || !yAxis || !Array.isArray(data) || data.length === 0) return {}
  const colors = getThemeColors(isDark)
  const points = data
    .map((r: any) => [+r?.[xAxis], +r?.[yAxis]])
    .filter(([x, y]) => Number.isFinite(x) && Number.isFinite(y))
  return {
    tooltip: { trigger: 'item' },
    grid: { left: 40, right: 20, top: 30, bottom: 40, containLabel: true },
    xAxis: { type: 'value', axisLine: { lineStyle: { color: colors.grid } }, axisLabel: { color: colors.text }, splitLine: { lineStyle: { color: colors.grid } } },
    yAxis: { type: 'value', axisLine: { lineStyle: { color: colors.grid } }, axisLabel: { color: colors.text }, splitLine: { lineStyle: { color: colors.grid } } },
    series: [{ type: 'scatter', data: points }],
  }
}

const ChartBuilder = ({ open, onClose, data, columns, onAdd }: ChartBuilderProps) => {
  const [type, setType] = useState<ChartType>('bar')
  const [xAxis, setXAxis] = useState('')
  const [yAxis, setYAxis] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const chartRef = useRef<HTMLDivElement | null>(null)
  const inst = useRef<any>(null)
  const isDarkRef = useDarkModeRef()

  const numericCols = useMemo(() => columns.filter(c => c && c.name && ['number', 'numeric'].includes((c.type || '').toLowerCase())), [columns])

  useEffect(() => {
    if (!open) return
    if (chartRef.current) inst.current = initChart(chartRef.current)
    return () => { inst.current?.dispose(); inst.current = null }
  }, [open])

  useEffect(() => {
    if (!inst.current) return
    const isDark = !!isDarkRef.current
    const option =
      type === 'scatter'
        ? buildScatterOption({ xAxis, yAxis, data, isDark })
        : buildAxisOption({ type, xAxis, yAxis, data, isDark })
    inst.current.setOption(option, { notMerge: true, lazyUpdate: true })
  }, [type, xAxis, yAxis, data, isDarkRef.current])

  const handleAdd = useCallback(() => {
    if (!xAxis) return setError('Please select the X axis.')
    if (!yAxis) return setError('Please select the Y axis.')
    setError('')
    const isDark = !!isDarkRef.current
    const option =
      type === 'scatter'
        ? buildScatterOption({ xAxis, yAxis, data, isDark })
        : buildAxisOption({ type, xAxis, yAxis, data, isDark })
    setIsLoading(true)
    onAdd({ type, option })
    setIsLoading(false)
    onClose()
  }, [type, xAxis, yAxis, data, onAdd, onClose])

  return (
    <Modal open={open} onClose={onClose} title="Build a Chart">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-3">
          <label className="block text-sm font-medium">Chart type</label>
          <Select value={type} onValueChange={(v) => setType(v as ChartType)}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bar"><div className="inline-flex items-center gap-2"><BarChart3 className="h-4 w-4" /> Bar</div></SelectItem>
              <SelectItem value="line"><div className="inline-flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Line</div></SelectItem>
              <SelectItem value="scatter"><div className="inline-flex items-center gap-2"><Zap className="h-4 w-4" /> Scatter</div></SelectItem>
            </SelectContent>
          </Select>

          <label className="block text-sm font-medium mt-4">X axis</label>
          <Select value={xAxis} onValueChange={setXAxis}>
            <SelectTrigger><SelectValue placeholder="Select X axis column" /></SelectTrigger>
            <SelectContent>
              {columns.map(c => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>

          <label className="block text-sm font-medium mt-4">Y axis</label>
          <Select value={yAxis} onValueChange={setYAxis}>
            <SelectTrigger><SelectValue placeholder="Select Y axis column" /></SelectTrigger>
            <SelectContent>
              {(numericCols.length ? numericCols : columns).map(c => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <div className="md:col-span-2 min-h-[320px] rounded-xl border border-zinc-200 dark:border-zinc-700">
          <div ref={chartRef as any} className="h-[320px]" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-zinc-500 dark:text-zinc-400 inline-flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          Make sure X and Y are valid for the chosen chart type.
        </div>
        <Button onClick={handleAdd} disabled={!xAxis || !yAxis || isLoading}>
          Add Chart
        </Button>
      </div>
    </Modal>
  )
}

export default ChartBuilder
