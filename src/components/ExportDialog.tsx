import Modal from './ui/Modal'
import Button from './ui/Button'
import { Download, FileText, FileJson } from 'lucide-react'

export default function ExportDialog({
  open,
  onClose,
  data,
  columns
}: { open: boolean; onClose: () => void; data: any[]; columns: any[] }) {
  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify({ columns, data }, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `export-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const downloadCSV = () => {
    const headers = columns.map(c => c.name).join(',')
    const rows = data.map(row =>
      columns.map(c => {
        const val = row[c.name]
        return typeof val === 'string' && val.includes(',') ? `"${val}"` : val ?? ''
      }).join(',')
    )
    const csv = [headers, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `export-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <Modal open={open} onClose={onClose} title="Export Dashboard">
      <div className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Select the format to download your data
        </p>

        <div className="space-y-3">
          <button
            onClick={downloadJSON}
            className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition"
          >
            <FileJson className="w-5 h-5 text-blue-500" />
            <div className="text-left">
              <p className="font-medium">JSON Format</p>
              <p className="text-xs text-gray-500">Structured data format</p>
            </div>
          </button>

          <button
            onClick={downloadCSV}
            className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition"
          >
            <FileText className="w-5 h-5 text-green-500" />
            <div className="text-left">
              <p className="font-medium">CSV Format</p>
              <p className="text-xs text-gray-500">Universal spreadsheet format</p>
            </div>
          </button>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  )
}