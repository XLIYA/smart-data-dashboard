// src/routes/preview/preview.tsx
import { useState } from 'react'
import { useDataStore } from '@/stores/dataStore'
import { useToast } from '@/components/ui/toast'
import DataTable from '@/components/DataTable'
import DataCleaningDialog from '@/components/data-cleaning-dialog'
import ExportDialog from '@/components/ExportDialog'
import { PreviewHeader } from './header'
import { EmptyState } from './empty-state'
import { PreviewCta } from './cta'
import { QuickInsights } from './quick-insights'
import Button from '@/components/ui/Button'
import { Sparkles, CheckCircle, Download } from 'lucide-react'

// اگر ColumnMeta را لازم دارید، از محل صحیحش ایمپورت کنید
// در اکثر پروژه‌ها این تایپ یا از dataStore اکسپورت می‌شود یا از یک فایل types.
// اگر از dataStore اکسپورت می‌شود خط زیر را آنکامنت کنید:
// import type { ColumnMeta } from '@/stores/dataStore'

const Preview = () => {
  const { data, columns, file, rows, setData } = useDataStore()
  const { showToast } = useToast()

  const [openCleaning, setOpenCleaning] = useState(false)
  const [openExport, setOpenExport] = useState(false)
  const [cleaningApplied, setCleaningApplied] = useState(false)

  const hasData = Array.isArray(data) && data.length > 0
  const hasCols = Array.isArray(columns) && columns.length > 0
  const disableCta = !hasData || !hasCols

  const handleApplyCleaning = (cleanedData: any[], report: any) => {
    setData({
      data: cleanedData,
      rows: cleanedData.length,
    })
    setCleaningApplied(true)

    const topChanges = Array.isArray(report?.changes) ? report.changes.slice(0, 3).join('\n') : ''
    const restCount =
      Array.isArray(report?.changes) && report.changes.length > 3
        ? `\n... and ${report.changes.length - 3} more operations`
        : ''

    showToast(
      'success',
      'Data Cleaned Successfully!',
      `Processed: ${Number(report?.originalRows ?? 0).toLocaleString()} rows
Final result: ${Number(report?.cleanedRows ?? cleanedData.length).toLocaleString()} rows
Removed: ${Number(report?.removedRows ?? 0).toLocaleString()} rows

${topChanges}${restCount}`,
      8000
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header + Actions */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <PreviewHeader
          rows={rows || 0}
          cols={columns?.length || 0}
          fileName={file?.name}
        />

        {hasData && hasCols && (
          <div className="flex items-center gap-2 flex-wrap">
            {/* Export */}
            <Button
              onClick={() => setOpenExport(true)}
              className="flex items-center gap-2"
              variant="secondary"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>

            {/* Clean Data */}
            <Button
              onClick={() => setOpenCleaning(true)}
              className={`flex items-center gap-2 ${
                cleaningApplied ? 'bg-green-600 hover:bg-green-700' : ''
              }`}
              variant={cleaningApplied ? 'primary' : 'secondary'}
            >
              {cleaningApplied ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Data Cleaned</span>
                  <span className="sm:hidden">Cleaned</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span className="hidden sm:inline">Clean Data</span>
                  <span className="sm:hidden">Clean</span>
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Cleaning badge */}
      {cleaningApplied && (
        <div className="p-3 rounded-lg bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-900 dark:text-green-100">
                Data has been cleaned and is ready for analysis
              </p>
              <p className="text-xs text-green-700 dark:text-green-300 mt-0.5">
                You can now create charts or export the cleaned data
              </p>
            </div>
            <button
              onClick={() => setCleaningApplied(false)}
              className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 text-xs font-medium"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Quick Insights */}
      {hasData && hasCols && <QuickInsights data={data} columns={columns} />}

      {/* Table or Empty */}
      {hasData && hasCols ? (
        <div className="animate-in slide-in-from-bottom-4 duration-700">
          <DataTable data={data} columns={columns} />
        </div>
      ) : (
        <EmptyState />
      )}

      {/* CTA */}
      <PreviewCta disabled={disableCta} />

      {/* Data Cleaning Dialog */}
      <DataCleaningDialog
        open={openCleaning}
        onClose={() => setOpenCleaning(false)}
        data={data}
        columns={columns}
        onApply={handleApplyCleaning}
      />

      {/* Export Dialog — دقت کنید columns نوع ColumnMeta[] است */}
      <ExportDialog
        open={openExport}
        onClose={() => setOpenExport(false)}
        data={hasData ? data : []}
        columns={hasCols ? columns : []} // ✅ Type صحیح: ColumnMeta[]
      />
    </div>
  )
}

export default Preview
