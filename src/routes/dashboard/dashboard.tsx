// src/routes/dashboard/dashboard.tsx
import { useState, useEffect } from 'react'
import { useDataStore } from '@/stores/dataStore'
import { useChartStore } from '@/stores/chartStore'
import { useToast } from '@/components/ui/toast'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import ChartBuilder from '@/components/ChartBuilder'
import ExportDialog from '@/components/ExportDialog'
import DataCleaningDialog from '@/components/data-cleaning-dialog'
import ConfirmDeleteModal from '@/components/confirm-delete-modal'
import {
  Trash2,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Sparkles,
  Download,
  Plus,
} from 'lucide-react'
import { EChartCard } from './echart-card'
import { StatsPanel } from './stats-panel'
import { generateAutoCharts } from '@/lib/auto-chart-generator'
import { useDarkModeRef } from '@/components/chart-builder/use-dark-mode-ref'

const Dashboard = () => {
  const data = useDataStore((s) => s.data)
  const columns = useDataStore((s) => s.columns)
  const setData = useDataStore((s) => s.setData)
  const { charts, addChart, removeChart, setCharts } = useChartStore()
  const { showToast } = useToast()

  const [openBuilder, setOpenBuilder] = useState(false)
  const [openExport, setOpenExport] = useState(false)
  const [openCleaning, setOpenCleaning] = useState(false)
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

      showToast(
        'success',
        'Charts Generated!',
        `${autoCharts.length} visualizations created automatically from your data`,
        5000
      )
    }
  }, [data, columns, charts.length, isDark, setCharts, hasGeneratedCharts, showToast])

  const onAddChart = (cfg: any) => {
    addChart(cfg)
    showToast('success', 'Chart Added!', `New ${cfg.type} chart created successfully`)
  }

  const onRemoveClick = (id: number) => setDeleteId(id)

  const onConfirmDelete = () => {
    if (deleteId != null) {
      removeChart(deleteId)
      showToast('success', 'Chart Deleted', 'Chart removed from dashboard')
      setDeleteId(null)
    }
  }

  const handleApplyCleaning = (cleanedData: any[], report: any) => {
    setData({
      data: cleanedData,
      rows: cleanedData.length,
    })

    // Regenerate charts with cleaned data
    const autoCharts = generateAutoCharts({ data: cleanedData, columns, isDark })
    setCharts(autoCharts.map((c, i) => ({ ...c, id: Date.now() + i })))

    showToast(
      'success',
      'Data Cleaned & Charts Regenerated!',
      `Applied ${report.changes.length} cleaning operations\nRemoved ${report.removedRows} rows\nUpdated all visualizations with clean data`,
      8000
    )
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {charts.length} chart{charts.length !== 1 ? 's' : ''} • {data.length.toLocaleString()}{' '}
            rows
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Clean Data Button */}
          <Button
            onClick={() => setOpenCleaning(true)}
            className="flex items-center gap-2"
            variant="secondary"
            disabled={addDisabled}
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Clean Data</span>
          </Button>

          {/* Add Chart Button */}
          <Button
            onClick={() => setOpenBuilder(true)}
            className="flex items-center gap-2"
            disabled={addDisabled}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Chart</span>
          </Button>

          {/* Export Button */}
          <Button
            onClick={() => setOpenExport(true)}
            className="flex items-center gap-2 bg-accent-500 hover:bg-accent-600"
            disabled={exportDisabled}
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      {/* Stats Panel */}
      {data.length > 0 && columns.length > 0 && <StatsPanel data={data} columns={columns} />}

      {/* Charts Grid */}
      {charts.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-accent-500/20 to-cyan-500/20 flex items-center justify-center">
              <BarChart3 className="w-10 h-10 text-accent-500" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                No charts yet
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {addDisabled
                  ? 'Upload data to get started with automatic chart generation'
                  : 'Charts will be generated automatically from your data'}
              </p>
            </div>
            {!addDisabled && (
              <Button onClick={() => setOpenBuilder(true)} className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Chart
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {charts.map((c) => {
            const Icon = getChartIcon(c.type)
            return (
              <Card
                key={c.id}
                className="p-0 overflow-hidden group relative hover:shadow-2xl transition-all duration-300"
              >
                {/* Chart Title */}
                {c.title && (
                  <div className="px-4 pt-4 pb-2 border-b border-gray-200/50 dark:border-white/10 bg-gradient-to-r from-white/50 to-white/30 dark:from-white/5 dark:to-white/[0.02]">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-accent-500/10">
                        <Icon className="w-4 h-4 text-accent-500" />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {c.title}
                      </h3>
                      {c.colorScheme && (
                        <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400">
                          {c.colorScheme}
                        </span>
                      )}
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
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-2 rounded-lg 
                    bg-red-500/20 text-red-600 hover:bg-red-500/30 transition-all backdrop-blur-sm
                    border border-red-500/30"
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
        columns={columns}  // ✅ Type صحیح: ColumnMeta[]
      />

      <DataCleaningDialog
        open={openCleaning}
        onClose={() => setOpenCleaning(false)}
        data={data}
        columns={columns}
        onApply={handleApplyCleaning}
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