// src/routes/dashboard/dashboard.tsx
import { useState, useEffect } from 'react'
import { useDataStore } from '@/stores/dataStore'
import { useChartStore } from '@/stores/chartStore'
import Card from '@/components/ui/Card'
import ChartBuilder from '@/components/ChartBuilder'
import ExportDialog from '@/components/ExportDialog'
import ConfirmDeleteModal from '@/components/confirm-delete-modal'
import { Trash2, TrendingUp, BarChart3, PieChart, Activity } from 'lucide-react'
import { EChartCard } from './echart-card'
import { Toolbar } from './toolbar'
import { StatsPanel } from './stats-panel'
import { generateAutoCharts } from '@/lib/auto-chart-generator'
import { useDarkModeRef } from '@/components/chart-builder/use-dark-mode-ref'

const Dashboard = () => {
  const data = useDataStore((s) => s.data)
  const columns = useDataStore((s) => s.columns)
  const { charts, addChart, removeChart, setCharts } = useChartStore()

  const [openBuilder, setOpenBuilder] = useState(false)
  const [openExport, setOpenExport] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [hasGeneratedCharts, setHasGeneratedCharts] = useState(false)

  const isDarkRef = useDarkModeRef()
  const isDark = isDarkRef.current

  const addDisabled = !data.length || !columns.length
  const exportDisabled = addDisabled

  // تولید خودکار چارت‌ها بعد از آپلود
  useEffect(() => {
    if (data.length > 0 && columns.length > 0 && charts.length === 0 && !hasGeneratedCharts) {
      const autoCharts = generateAutoCharts({ data, columns, isDark })
      setCharts(autoCharts.map((c, i) => ({ ...c, id: Date.now() + i })))
      setHasGeneratedCharts(true)
    }
  }, [data, columns, charts.length, isDark, setCharts, hasGeneratedCharts])

  const onAddChart = (cfg: any) => addChart(cfg)
  const onRemoveClick = (id: number) => setDeleteId(id)
  const onConfirmDelete = () => {
    if (deleteId != null) removeChart(deleteId)
    setDeleteId(null)
  }

  const getChartIcon = (type: string) => {
    switch (type) {
      case 'bar':
        return BarChart3
      case 'line':
        return TrendingUp
      case 'scatter':
        return Activity
      case 'pie':
        return PieChart
      default:
        return BarChart3
    }
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

      {/* Stats Panel */}
      {data.length > 0 && columns.length > 0 && (
        <StatsPanel data={data} columns={columns} />
      )}

      {/* Charts Grid */}
      {charts.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-accent-500/20 to-cyan-500/20 flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-accent-500" />
            </div>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              No charts yet
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Upload data and charts will be generated automatically
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {charts.map((c) => {
            const Icon = getChartIcon(c.type)
            return (
              <Card
                key={c.id}
                className="p-0 overflow-hidden group relative hover:shadow-xl transition-all duration-300"
              >
                {/* Chart Title */}
                {c.title && (
                  <div className="px-4 pt-4 pb-2 border-b border-gray-200/50 dark:border-white/10">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-accent-500" />
                      <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {c.title}
                      </h3>
                    </div>
                  </div>
                )}

                {/* Chart */}
                <div className="p-4">
                  <EChartCard option={c.option} />
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => onRemoveClick(c.id)}
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-2 rounded-lg bg-red-500/20 text-red-600 hover:bg-red-500/30 transition-all backdrop-blur-sm"
                  title="Delete chart"
                  aria-label="Delete chart"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </Card>
            )
          })}
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

      <ConfirmDeleteModal
        open={deleteId != null}
        onClose={() => setDeleteId(null)}
        onConfirm={onConfirmDelete}
      />
    </div>
  )
}

export default Dashboard