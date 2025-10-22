// src/routes/preview/preview.tsx
import { useDataStore } from '@/stores/dataStore'
import DataTable from '@/components/DataTable'
import { PreviewHeader } from './header'
import { EmptyState } from './empty-state'
import { PreviewCta } from './cta'
import { QuickInsights } from './quick-insights'

const Preview = () => {
  const { data, columns, file, rows } = useDataStore()
  const hasData = Array.isArray(data) && data.length > 0
  const hasCols = Array.isArray(columns) && columns.length > 0
  const disableCta = !hasData || !hasCols

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <PreviewHeader rows={rows || 0} cols={columns?.length || 0} fileName={file?.name} />

      {/* Quick Insights */}
      {hasData && hasCols && <QuickInsights data={data} columns={columns} />}

      {/* Table or empty notice */}
      {hasData && hasCols ? (
        <div className="animate-in slide-in-from-bottom-4 duration-700">
          <DataTable data={data} columns={columns} />
        </div>
      ) : (
        <EmptyState />
      )}

      {/* CTA */}
      <PreviewCta disabled={disableCta} />
    </div>
  )
}

export default Preview