import { useState, useEffect, useRef } from 'react'
import { useDataStore } from '@/stores/dataStore'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import ChartBuilder from '@/components/ChartBuilder'
import ExportDialog from '@/components/ExportDialog'
import { initChart } from '@/lib/echarts'
import { Plus, Download, Trash2 } from 'lucide-react'

function EChartCard({ option }: { option: any }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current) return
    const inst = initChart(ref.current)
    inst.setOption(option, true)
    const onR = () => inst.resize()
    window.addEventListener('resize', onR)
    return () => {
      window.removeEventListener('resize', onR)
      inst.dispose()
    }
  }, [option])
  return <div ref={ref} className="h-[300px] lg:h-[400px]" />
}

export default function Dashboard() {
  const data = useDataStore(s => s.data)
  const columns = useDataStore(s => s.columns)
  const [charts, setCharts] = useState<any[]>([])
  const [openBuilder, setOpenBuilder] = useState(false)
  const [openExport, setOpenExport] = useState(false)

  const removeChart = (id: number) => {
    setCharts(prev => prev.filter(c => c.id !== id))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {charts.length} chart{charts.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setOpenBuilder(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Chart
          </Button>
          <Button
            onClick={() => setOpenExport(true)}
            className="flex items-center gap-2 bg-accent-500"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Charts Grid */}
      {charts.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="space-y-3">
            <p className="text-lg text-gray-500 dark:text-gray-400">No charts yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">Click "Add Chart" to create your first chart</p>
          </div>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-1 gap-8 p-0">
          {charts.map(c => (
            <Card key={c.id} className="p-0 overflow-hidden group relative">
              <EChartCard option={c.option} />
              <button
                onClick={() => removeChart(c.id)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-2 rounded-lg bg-red-500/20 text-red-600 hover:bg-red-500/30 transition-all"
                title="Delete chart"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </Card>
          ))}
        </div>
      )}

      <ChartBuilder
        open={openBuilder}
        onClose={() => setOpenBuilder(false)}
        data={data}
        columns={columns}
        onAdd={(cfg) => setCharts(prev => [...prev, { id: Date.now(), ...cfg }])}
      />
      <ExportDialog
        open={openExport}
        onClose={() => setOpenExport(false)}
        data={data}
        columns={columns}
      />
    </div>
  )
}