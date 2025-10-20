// src/components/ChartBuilder.tsx
import { useEffect, useMemo, useRef, useState } from 'react'
import Modal from './ui/Modal'
import Button from './ui/Button'
import Select from './ui/Select'
import { initChart } from '@/lib/echarts'

type ChartType = 'bar' | 'line' | 'pie' | 'scatter'

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
  onAdd: (cfg: any) => void
}) {
  const [type, setType] = useState<ChartType>('bar')
  const [xAxis, setXAxis] = useState<string>('')
  const [yAxis, setYAxis] = useState<string>('')
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<any>(null)

  // تمام columns (برای X axis میتونه هر column باشه)
  const allColumns = useMemo(() => {
    return Array.isArray(columns) ? columns : []
  }, [columns])

  // فقط number columns (برای Y axis)
  const numCols = useMemo(() => {
    return allColumns.filter((c: any) => c?.type === 'number' || c?.type === 'string')
  }, [allColumns])

  useEffect(() => {
    // وقتی modal باز شد، اولین column رو انتخاب کن
    if (open && allColumns.length > 0) {
      if (!xAxis) setXAxis(allColumns[0].name)
      if (!yAxis && numCols.length > 0) setYAxis(numCols[0].name)
    }
  }, [open, allColumns])

  useEffect(() => {
    if (!open || !chartRef.current || !xAxis || !yAxis || data.length === 0) return

    if (!chartInstance.current) {
      chartInstance.current = initChart(chartRef.current)
    }

    const option = buildOption()
    chartInstance.current.setOption(option, true)
  }, [type, xAxis, yAxis, open, data])

  const buildOption = () => {
    try {
      const xData = [...new Set(data.map((r: any) => String(r[xAxis])))]
        .slice(0, 20)
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

      const isDark = document.documentElement.classList.contains('dark')
      const textColor = isDark ? '#f3f4f6' : '#374151'
      const gridColor = isDark ? '#4b5563' : '#e5e7eb'

      const baseOption = {
        tooltip: {
          trigger: 'axis',
          backgroundColor: isDark ? '#1f2937' : '#fff',
          borderColor: isDark ? '#374151' : '#e5e7eb',
          textStyle: { color: isDark ? '#f3f4f6' : '#000' }
        },
        legend: {
          data: [yAxis],
          textStyle: { color: textColor, fontSize: 13 }
        },
        grid: {
          left: 60,
          right: 20,
          top: 20,
          bottom: 40,
          borderColor: gridColor
        },
        xAxis:
          type === 'scatter'
            ? {
                type: 'value',
                axisLabel: { color: textColor, fontSize: 12 },
                axisLine: { lineStyle: { color: gridColor } }
              }
            : {
                type: 'category',
                data: xData,
                axisLabel: { color: textColor, fontSize: 12 },
                axisLine: { lineStyle: { color: gridColor } }
              },
        yAxis: {
          type: 'value',
          axisLabel: { color: textColor, fontSize: 12 },
          axisLine: { lineStyle: { color: gridColor } },
          splitLine: { lineStyle: { color: gridColor, type: 'dashed' } }
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
              itemStyle: { color: '#14c3c3' }
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
              smooth: true,
              itemStyle: { color: '#14c3c3' },
              areaStyle: { color: 'rgba(20, 195, 195, 0.1)' }
            }
          ]
        }
      } else if (type === 'pie') {
        const isDark = document.documentElement.classList.contains('dark')
        const textColor = isDark ? '#f3f4f6' : '#374151'
        return {
          tooltip: {
            trigger: 'item',
            backgroundColor: isDark ? '#1f2937' : '#fff',
            borderColor: isDark ? '#374151' : '#e5e7eb',
            textStyle: { color: isDark ? '#f3f4f6' : '#000' }
          },
          legend: {
            data: xData,
            textStyle: { color: textColor, fontSize: 13 }
          },
          series: [
            {
              name: yAxis,
              data: xData.map((x: any, i: number) => ({
                value: yData[i],
                name: String(x)
              })),
              type: 'pie'
            }
          ]
        }
      } else if (type === 'scatter') {
        const scatterData = data
          .slice(0, 100)
          .map((r: any) => [Number(r[xAxis]) || 0, Number(r[yAxis]) || 0])
        return {
          ...baseOption,
          series: [
            {
              data: scatterData,
              type: 'scatter',
              symbolSize: 8,
              itemStyle: { color: '#14c3c3' }
            }
          ]
        }
      }
      return baseOption
    } catch (error) {
      console.error('Chart build error:', error)
      return {}
    }
  }

  const handleAdd = () => {
    if (!xAxis || !yAxis) {
      alert('Please select both X and Y axis columns')
      return
    }
    onAdd({ option: buildOption(), type, xAxis, yAxis })
    onClose()
    setType('bar')
    setXAxis('')
    setYAxis('')
  }

  if (!open) return null

  return (
    <Modal open={open} onClose={onClose} title="Create Chart">
      <div className="space-y-6">
        {/* Debug Info */}
        {allColumns.length === 0 && (
          <div className="p-3 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 rounded-lg text-sm">
            ⚠️ No columns found. Please upload data first.
          </div>
        )}

        {/* Chart Type */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-900 dark:text-white">
            Chart Type
          </label>
          <Select value={type} onChange={(e) => setType(e.target.value as ChartType)}>
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
            <option value="pie">Pie Chart</option>
            <option value="scatter">Scatter Plot</option>
          </Select>
        </div>

        {/* X Axis */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-900 dark:text-white">
            Category (X-Axis)
          </label>
          {allColumns.length === 0 ? (
            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm text-gray-600 dark:text-gray-400">
              No columns available
            </div>
          ) : (
            <Select value={xAxis} onChange={(e) => setXAxis(e.target.value)}>
              <option value="">Select a column</option>
              {allColumns.map((c: any) => (
                <option key={c?.name} value={c?.name}>
                  {c?.name}
                </option>
              ))}
            </Select>
          )}
        </div>

        {/* Y Axis */}
        {type !== 'pie' && (
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900 dark:text-white">
              Values (Y-Axis)
            </label>
            {numCols.length === 0 ? (
              <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm text-gray-600 dark:text-gray-400">
                No numeric columns available
              </div>
            ) : (
              <Select value={yAxis} onChange={(e) => setYAxis(e.target.value)}>
                <option value="">Select a column</option>
                {numCols.map((c: any) => (
                  <option key={c?.name} value={c?.name}>
                    {c?.name}
                  </option>
                ))}
              </Select>
            )}
          </div>
        )}

        {/* Preview */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-900 dark:text-white">
            Preview
          </label>
          <div
            ref={chartRef}
            className="h-64 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900/50"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-white/10">
          <button
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition text-gray-900 dark:text-white font-medium"
            onClick={onClose}
          >
            Cancel
          </button>
          <Button onClick={handleAdd} disabled={!xAxis || !yAxis}>
            Add Chart
          </Button>
        </div>
      </div>
    </Modal>
  )
}