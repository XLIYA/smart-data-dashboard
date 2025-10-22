// src/components/export-dialog/export-dialog.tsx
import { useState } from 'react'
import Modal from '../ui/Modal'
import { FileText, FileJson, FileDown, Loader2 } from 'lucide-react'
import { useToast } from '../ui/toast'
import { getFileName } from './get-file-name'
import { downloadBlob } from './download'
import { buildJsonBlob } from './export-json'
import { buildCsvBlob } from './export-csv'
import { exportToPDF } from '@/lib/pdf-export'
import { calculateStatistics } from '@/lib/data-mining'
import type { ExportDialogProps } from './types'

const ExportDialog = ({ open, onClose, data, columns }: ExportDialogProps) => {
  const { showToast } = useToast()
  const [isExporting, setIsExporting] = useState(false)
  const [exportType, setExportType] = useState<string | null>(null)

  const disabled =
    !Array.isArray(data) ||
    data.length === 0 ||
    !Array.isArray(columns) ||
    columns.length === 0

  const onDownloadJSON = () => {
    try {
      const blob = buildJsonBlob({ data, columns })
      downloadBlob(blob, getFileName('json'))
      showToast(
        'success',
        'JSON Exported Successfully!',
        `${data.length} rows exported in JSON format`
      )
    } catch (error) {
      console.error('JSON export error:', error)
      showToast('error', 'Export Failed', 'Could not export JSON file. Please try again.')
    }
  }

  const onDownloadCSV = () => {
    try {
      const blob = buildCsvBlob({ data, columns })
      downloadBlob(blob, getFileName('csv'))
      showToast(
        'success',
        'CSV Exported Successfully!',
        `${data.length} rows exported in CSV format`
      )
    } catch (error) {
      console.error('CSV export error:', error)
      showToast('error', 'Export Failed', 'Could not export CSV file. Please try again.')
    }
  }

  const onDownloadPDF = async () => {
    setIsExporting(true)
    setExportType('pdf')

    try {
      // Get chart elements
      const chartElements = Array.from(
        document.querySelectorAll('[data-chart-container]')
      ) as HTMLElement[]

      // Calculate statistics
      const stats = calculateStatistics(data, columns)

      showToast('info', 'Generating PDF...', 'Please wait while we create your report', 0)

      await exportToPDF({
        data,
        columns,
        charts: chartElements.slice(0, 4), // Maximum 4 charts
        fileName: getFileName(''),
        title: 'Data Analysis Report',
      })

      showToast(
        'success',
        'PDF Report Generated!',
        `Complete analysis report with ${chartElements.length} charts has been downloaded`,
        6000
      )
    } catch (error) {
      console.error('PDF export error:', error)
      showToast(
        'error',
        'PDF Export Failed',
        'An error occurred while generating the report. Please try again.'
      )
    } finally {
      setIsExporting(false)
      setExportType(null)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Export Data">
      <div className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Choose your preferred export format
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* JSON Export */}
          <button
            onClick={onDownloadJSON}
            disabled={disabled || isExporting}
            className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 
              hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 
              transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed 
              disabled:hover:border-zinc-200 dark:disabled:hover:border-zinc-700 
              disabled:hover:bg-transparent group"
          >
            <div className="p-2 rounded-lg bg-blue-500/15 dark:bg-blue-500/20 group-hover:bg-blue-500/25 transition-colors">
              <FileJson className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-left flex-1">
              <p className="font-semibold text-gray-900 dark:text-white">JSON</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Structured data format
              </p>
            </div>
          </button>

          {/* CSV Export */}
          <button
            onClick={onDownloadCSV}
            disabled={disabled || isExporting}
            className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 
              hover:border-emerald-400 dark:hover:border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 
              transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed 
              disabled:hover:border-zinc-200 dark:disabled:hover:border-zinc-700 
              disabled:hover:bg-transparent group"
          >
            <div className="p-2 rounded-lg bg-emerald-500/15 dark:bg-emerald-500/20 group-hover:bg-emerald-500/25 transition-colors">
              <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-left flex-1">
              <p className="font-semibold text-gray-900 dark:text-white">CSV</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Best for Excel & Sheets
              </p>
            </div>
          </button>

          {/* PDF Export */}
          <button
            onClick={onDownloadPDF}
            disabled={disabled || isExporting}
            className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 
              hover:border-red-400 dark:hover:border-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 
              transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed 
              disabled:hover:border-zinc-200 dark:disabled:hover:border-zinc-700 
              disabled:hover:bg-transparent group relative"
          >
            {isExporting && exportType === 'pdf' && (
              <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-red-600" />
                  <span className="text-sm font-medium text-red-600">Generating...</span>
                </div>
              </div>
            )}
            <div className="p-2 rounded-lg bg-red-500/15 dark:bg-red-500/20 group-hover:bg-red-500/25 transition-colors">
              <FileDown className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div className="text-left flex-1">
              <p className="font-semibold text-gray-900 dark:text-white">PDF Report</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Complete analysis
              </p>
            </div>
          </button>
        </div>

        {/* Info Message */}
        <div className="p-4 rounded-lg bg-accent-50 dark:bg-accent-500/10 border border-accent-200 dark:border-accent-500/30">
          <div className="flex items-start gap-3">
            <FileDown className="w-5 h-5 text-accent-600 dark:text-accent-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-sm">
              <p className="font-semibold text-accent-900 dark:text-accent-100 mb-1">
                PDF Report Includes:
              </p>
              <ul className="text-xs text-accent-700 dark:text-accent-300 space-y-0.5">
                <li>• Dataset statistics and overview</li>
                <li>• Column-wise detailed analysis</li>
                <li>• Correlation analysis with visualizations</li>
                <li>• Outlier detection results</li>
                <li>• All charts and visualizations</li>
                <li>• Data table (first 100 rows)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Data Summary */}
        {!disabled && (
          <div className="pt-3 border-t border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Ready to export:</span>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {data.length.toLocaleString()} rows
                </span>
                <span className="text-gray-400">•</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {columns.length} columns
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default ExportDialog