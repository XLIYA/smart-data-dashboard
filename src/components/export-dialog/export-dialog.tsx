import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { Download, FileText, FileJson } from 'lucide-react'
import { getFileName } from './get-file-name'
import { downloadBlob } from './download'
import { buildJsonBlob } from './export-json'
import { buildCsvBlob } from './export-csv'
import type { ExportDialogProps } from './types'

const ExportDialog = ({ open, onClose, data, columns }: ExportDialogProps) => {
  const disabled = !Array.isArray(data) || data.length === 0 || !Array.isArray(columns) || columns.length === 0

  const onDownloadJSON = () => {
    const blob = buildJsonBlob({ data, columns })
    downloadBlob(blob, getFileName('json'))
  }

  const onDownloadCSV = () => {
    const blob = buildCsvBlob({ data, columns, includeBom: true })
    downloadBlob(blob, getFileName('csv'))
  }

  if (!open) return null

  return (
    <Modal open={open} onClose={onClose} title="Export Dashboard">
      <div className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Select the format to download your data
        </p>

        <div className="space-y-3">
          <button
            onClick={onDownloadJSON}
            disabled={disabled}
            className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileJson className="w-5 h-5 text-blue-500" />
            <div className="text-left">
              <p className="font-medium">JSON Format</p>
              <p className="text-xs text-gray-500">Structured data format</p>
            </div>
          </button>

          <button
            onClick={onDownloadCSV}
            disabled={disabled}
            className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileText className="w-5 h-5 text-green-500" />
            <div className="text-left">
              <p className="font-medium">CSV Format</p>
              <p className="text-xs text-gray-500">Universal spreadsheet format</p>
            </div>
          </button>
        </div>

        <div className="flex justify-between items-center pt-4">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {Array.isArray(data) ? `${data.length} rows` : '—'} · {Array.isArray(columns) ? `${columns.length} cols` : '—'}
          </div>
          <div className="flex gap-3">
            <button
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition"
              onClick={onClose}
            >
              Cancel
            </button>
            <Button onClick={onClose} className="gap-2">
              <Download className="w-4 h-4" />
              Done
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ExportDialog
