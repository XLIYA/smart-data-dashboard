import Button from '@/components/ui/Button'
import { Plus, Download } from 'lucide-react'

type Props = {
  chartsCount: number
  onAdd: () => void
  onExport: () => void
  addDisabled?: boolean
  exportDisabled?: boolean
}

export const Toolbar = ({ chartsCount, onAdd, onExport, addDisabled, exportDisabled }: Props) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
        {chartsCount} chart{chartsCount !== 1 ? 's' : ''}
      </p>
    </div>

    <div className="flex items-center gap-3">
      <Button onClick={onAdd} className="flex items-center gap-2" disabled={addDisabled}>
        <Plus className="w-4 h-4" />
        Add Chart
      </Button>
      <Button
        onClick={onExport}
        className="flex items-center gap-2 bg-accent-500"
        disabled={exportDisabled}
      >
        <Download className="w-4 h-4" />
        Export
      </Button>
    </div>
  </div>
)
