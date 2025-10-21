// src/components/chart-builder/chart-builder.tsx
import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import type { ECharts } from '@/lib/echarts'
import { initChart } from '@/lib/echarts'

import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../ui/select'

import { BarChart3, TrendingUp, Zap, CheckCircle } from 'lucide-react'
import type { ChartBuilderProps, ChartConfig, ChartType } from './chart-types'
import { useDarkModeRef } from './use-dark-mode-ref'
import { buildAxisOption } from './build-axis-option'
import { buildScatterOption } from './build-scatter-option'

const ChartBuilder = ({ open, onClose, data, columns, onAdd }: ChartBuilderProps) => {
  const [type, setType] = useState<ChartType>('bar')
  const [xAxis, setXAxis] = useState<string>('')
  const [yAxis, setYAxis] = useState<string>('')

  const ref = useRef<HTMLDivElement | null>(null)
  const inst = useRef<ECharts | null>(null)

  // theme
  const isDarkRef = useDarkModeRef()
  const isDark = isDarkRef.current

  const numberColumns = useMemo(
    () => columns.filter((c) => c.type === 'number'),
    [columns]
  )

  // init / dispose
  useEffect(() => {
    if (!open || !ref.current) return
    inst.current = initChart(ref.current)
    return () => {
      inst.current?.dispose()
      inst.current = null
    }
  }, [open])

  // live preview
  useEffect(() => {
    if (!inst.current) return
    if (!xAxis || !yAxis) {
      inst.current.clear()
      inst.current.setOption({})
      return
    }

    const opt =
      type === 'scatter'
        ? buildScatterOption({ data, xAxis, yAxis, isDark })
        : buildAxisOption({ data, xAxis, yAxis, type, isDark })

    inst.current.setOption(opt, true)
  }, [data, xAxis, yAxis, type, isDark])

  // add chart config
  const handleAdd = useCallback(() => {
    if (!xAxis || !yAxis) return

    const option =
      type === 'scatter'
        ? buildScatterOption({ data, xAxis, yAxis, isDark })
        : buildAxisOption({ data, xAxis, yAxis, type, isDark })

    const cfg: ChartConfig = { type, xAxis, yAxis, option }
    onAdd(cfg)
    onClose()
  }, [type, xAxis, yAxis, isDark, data, onAdd, onClose])

  return (
    <Modal open={open} onClose={onClose} title="Chart Builder">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {/* Chart Type */}
        <div className="md:col-span-1 flex flex-col gap-2">
          <label className="text-sm font-medium">Chart Type</label>
          <Select value={type} onValueChange={(v) => setType(v as ChartType)}>
            <SelectTrigger className="h-9 rounded-lg border px-3">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bar"><div className="flex items-center gap-2"><BarChart3 size={16}/> Bar</div></SelectItem>
              <SelectItem value="line"><div className="flex items-center gap-2"><TrendingUp size={16}/> Line</div></SelectItem>
              <SelectItem value="scatter"><div className="flex items-center gap-2"><Zap size={16}/> Scatter</div></SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* X Axis */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">X Axis</label>
          <Select value={xAxis} onValueChange={setXAxis}>
            <SelectTrigger className="h-9 rounded-lg border px-3">
              <SelectValue placeholder="Select X column" />
            </SelectTrigger>
            <SelectContent>
              {columns.map((c) => (
                <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Y Axis */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Y Axis (numeric)</label>
          <Select value={yAxis} onValueChange={setYAxis}>
            <SelectTrigger className="h-9 rounded-lg border px-3">
              <SelectValue placeholder="Select Y column" />
            </SelectTrigger>
            <SelectContent>
              {numberColumns.map((c) => (
                <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Preview */}
      <div className="mt-4">
        <div ref={ref} className="h-[320px] w-full rounded-xl border" />
      </div>

      {/* Actions */}
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={handleAdd}><CheckCircle size={16}/> Add</Button>
      </div>
    </Modal>
  )
}

export default ChartBuilder
