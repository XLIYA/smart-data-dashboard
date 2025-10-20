import { useDataStore } from '@/stores/dataStore'
import DataTable from '@/components/DataTable'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/ui/Button'
import { ArrowRight } from 'lucide-react'

export default function Preview() {
  const { data, columns, file, rows } = useDataStore()
  const nav = useNavigate()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Data Preview</h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span className="font-medium">{rows} rows</span>
          <span>•</span>
          <span className="font-medium">{columns.length} columns</span>
          <span>•</span>
          <span className="font-medium">{file?.name}</span>
        </div>
      </div>

      {/* Table */}
      <DataTable data={data} columns={columns} />

      {/* CTA */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={() => nav('/dashboard')}
          className="flex items-center gap-2"
        >
          Create Dashboard
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}