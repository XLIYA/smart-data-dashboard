import Button from './ui/Button'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDataStore } from '@/stores/dataStore'
import { Upload, File } from 'lucide-react'

export default function UploadDropzone() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [drag, setDrag] = useState(false)
  const setData = useDataStore(s => s.setData)
  const nav = useNavigate()

  const onFiles = async (file: File) => {
    const isCsv = /\.csv$/i.test(file.name)
    const text = await file.text()
    const rows = isCsv ? csvToJson(text) : []
    const columns = Object.keys(rows[0] || {}).map(k => ({
      name: k,
      type: guessType(rows.map(r => r[k]))
    }))
    setData({
      file: { name: file.name, size: file.size, type: file.type },
      rows: rows.length,
      columns,
      data: rows
    })
    nav('/preview')
  }

  return (
    <div
      className={`relative rounded-2xl border-2 border-dashed transition-all p-8 cursor-pointer ${
        drag
          ? 'border-accent-500 bg-accent-50/50 dark:bg-accent-500/10'
          : 'border-slate-300 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/20'
      }`}
      onDragOver={(e) => {
        e.preventDefault()
        setDrag(true)
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDrag(false)
        const f = e.dataTransfer.files?.[0]
        if (f) onFiles(f)
      }}
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
            Drag and drop your CSV file here or click to browse
          </p>
        </div>

        <Button onClick={() => inputRef.current?.click()}>
          <Upload className="w-4 h-4" />
          Select File
        </Button>
      </div>
    </div>
  )
}

function csvToJson(text: string) {
  const [header, ...lines] = text.split(/\r?\n/).filter(Boolean)
  const cols = header.split(',').map(c => c.trim())
  return lines.map(l => {
    const parts = l.split(',')
    const obj: Record<string, any> = {}
    cols.forEach((c, i) => (obj[c] = parts[i]?.trim()))
    return obj
  })
}

function guessType(vals: any[]): 'number' | 'string' | 'date' | 'boolean' {
  const sample = vals.slice(0, 100).filter(v => v != null && String(v).trim() !== '')
  const n = sample.filter(v => !isNaN(Number(v))).length
  if (n / Math.max(1, sample.length) > 0.8) return 'number'
  const b = sample.filter(v => ['true', 'false', true, false].includes(v as any)).length
  if (b / Math.max(1, sample.length) > 0.8) return 'boolean'
  const d = sample.filter(v => /^\d{4}-\d{2}-\d{2}$/.test(String(v))).length
  if (d / Math.max(1, sample.length) > 0.6) return 'date'
  return 'string'
}