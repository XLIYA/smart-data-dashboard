import Button from '../ui/Button'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDataStore } from '@/stores/dataStore'
import { Upload } from 'lucide-react'
import { parseCsv } from './parse-csv'
import { parseXlsx } from './parse-xlsx'
import { inferColumns } from './infer-columns'
import { useDnd } from './use-dnd'

const UploadDropzone = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  const { drag, onDragOver, onDragLeave, onDrop } = useDnd()
  const [busy, setBusy] = useState(false)
  const setData = useDataStore(s => s.setData)
  const nav = useNavigate()

  const onFiles = async (file: File) => {
    try {
      setBusy(true)
      const lower = file.name.toLowerCase()
      let rows: Record<string, any>[] = []

      if (lower.endsWith('.csv')) {
        const text = await file.text()
        rows = parseCsv(text)
      } else if (lower.endsWith('.xlsx')) {
        try {
          rows = await parseXlsx(file)
        } catch (err) {
          console.error('xlsx parse error:', err)
          alert('XLSX parser not available. Please install "xlsx" package or upload a CSV file.')
          return
        }
      } else {
        alert('Unsupported file type. Please upload a CSV or XLSX file.')
        return
      }

      if (!rows.length) {
        alert('No rows detected in file.')
        return
      }

      const columns = inferColumns(rows)

      setData({
        file: { name: file.name, size: file.size, type: file.type },
        rows: rows.length,
        columns,
        data: rows,
      })

      nav('/preview')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      className={`relative rounded-2xl border-2 border-dashed transition-all p-8 cursor-pointer ${
        drag
          ? 'border-accent-500 bg-accent-50/50 dark:bg-accent-500/10'
          : 'border-slate-300 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/20'
      } ${busy ? 'opacity-70 pointer-events-none' : ''}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, onFiles)}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.xlsx"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) onFiles(f)
        }}
      />

      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-12 h-12 rounded-lg bg-accent-100 dark:bg-accent-500/20 flex items-center justify-center">
          <Upload className="w-6 h-6 text-accent-600 dark:text-accent-400" />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Upload your data
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Drag and drop your <strong>CSV or XLSX</strong> file here or click to browse
          </p>
        </div>

        <Button onClick={() => inputRef.current?.click()} disabled={busy}>
          <Upload className="w-4 h-4" />
          {busy ? 'Processing…' : 'Select File'}
        </Button>
      </div>
    </div>
  )
}

export default UploadDropzone
