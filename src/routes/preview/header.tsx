import { Paperclip, Table2, Rows } from 'lucide-react'

type Props = {
  rows: number
  cols: number
  fileName?: string
}

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium
    bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300">
    {children}
  </span>
)

export const PreviewHeader = ({ rows, cols, fileName }: Props) => (
  <div className="space-y-2">
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Data Preview</h1>
    <div className="flex flex-wrap items-center gap-2">
      <Badge><Rows className="w-3.5 h-3.5" /> {rows.toLocaleString()} rows</Badge>
      <Badge><Table2 className="w-3.5 h-3.5" /> {cols} columns</Badge>
      {fileName && (
        <Badge>
          <Paperclip className="w-3.5 h-3.5" />
          <span className="max-w-[220px] truncate" title={fileName}>{fileName}</span>
        </Badge>
      )}
    </div>
  </div>
)
