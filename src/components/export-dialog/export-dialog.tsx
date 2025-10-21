// src/components/export-dialog/export-dialog.tsx
import Modal from '../ui/Modal'
import { FileText, FileJson } from 'lucide-react'
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
    const blob = buildCsvBlob({ data, columns })
    downloadBlob(blob, getFileName('csv'))
  }

  return (
    <Modal open={open} onClose={onClose} title="Export">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <button
          onClick={onDownloadJSON}
          disabled={disabled}
          className="w-full flex items-center gap-3 p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-white/5 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FileJson className="w-5 h-5 text-blue-500" />
          <div className="text-left">
            <p className="font-medium">JSON Format</p>
            <p className="text-xs text-zinc-500">Structured data format</p>
          </div>
        </button>

        <button
          onClick={onDownloadCSV}
          disabled={disabled}
          className="w-full flex items-center gap-3 p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-white/5 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FileText className="w-5 h-5 text-emerald-600" />
          <div className="text-left">
            <p className="font-medium">CSV Format</p>
            <p className="text-xs text-zinc-500">Best for Excel and Sheets</p>
          </div>
        </button>
      </div>
    </Modal>
  )
}

export default ExportDialog
