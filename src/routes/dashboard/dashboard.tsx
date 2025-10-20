import { useDataStore } from '@/stores/dataStore'
import Card from '@/components/ui/Card'
import ChartBuilder from '@/components/ChartBuilder'
import ExportDialog from '@/components/ExportDialog'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useCharts } from './use-charts'
import { EChartCard } from './echart-card'
import { Toolbar } from './toolbar'
import type { ChartEntry } from './types'

const Dashboard = () => {
  const data = useDataStore(s => s.data)
  const columns = useDataStore(s => s.columns)

  const { charts, addChart, removeChart } = useCharts()

  const [openBuilder, setOpenBuilder] = useState(false)
  const [openExport, setOpenExport] = useState(false)

  const addDisabled = !Array.isArray(data) || data.length === 0 || !Array.isArray(columns) || columns.length === 0
  const exportDisabled = addDisabled

  const onAddChart = (cfg: Omit<ChartEntry, 'id'>) => addChart(cfg)

  const onRemoveChart = (id: number) => {
    if (confirm('Delete this chart?')) removeChart(id)
  }

  return (
    <div className="space-y-8">
      {/* Header / Toolbar */}
      <Toolbar
        chartsCount={charts.length}
        onAdd={() => setOpenBuilder(true)}
        onExport={() => setOpenExport(true)}
        addDisabled={addDisabled}
        exportDisabled={exportDisabled}
      />

      {/* Charts Grid */}
      {charts.length === 0 ? (
        <Card className="p-0 overflow-hidden">
          {/* Empty state */}
          <div className="p-12 text-center">
            <div className="space-y-3">
              <p className="text-lg text-gray-500 dark:text-gray-400">No charts yet</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">Click "Add Chart" to create your first chart</p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-2 gap-8 p-0">
          {charts.map(c => (
            <Card key={c.id} className="p-0 overflow-hidden group relative">
              <EChartCard option={c.option} />
              <button
                onClick={() => onRemoveChart(c.id)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-2 rounded-lg bg-red-500/20 text-red-600 hover:bg-red-500/30 transition-all"
                title="Delete chart"
                aria-label="Delete chart"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </Card>
          ))}
        </div>
      )}

      {/* Modals */}
      <ChartBuilder
        open={openBuilder}
        onClose={() => setOpenBuilder(false)}
        data={data}
        columns={columns}
        onAdd={onAddChart}
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

export default Dashboard
