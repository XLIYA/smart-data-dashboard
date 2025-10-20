import { useDataStore } from '@/stores/dataStore'
import DataTable from '@/components/DataTable'
import { PreviewHeader } from './header'
import { EmptyState } from './empty-state'
import { PreviewCta } from './cta'

const Preview = () => {
  const { data, columns, file, rows } = useDataStore()
  const hasData = Array.isArray(data) && data.length > 0
  const hasCols = Array.isArray(columns) && columns.length > 0
  const disableCta = !hasData || !hasCols

  return (
    <div className="space-y-6">
      {/* Header */}
      <PreviewHeader rows={rows || 0} cols={columns?.length || 0} fileName={file?.name} />

      {/* Table or empty notice */}
      {hasData && hasCols ? (
        <DataTable data={data} columns={columns} />
      ) : (
        <EmptyState />
      )}

      {/* CTA */}
      <PreviewCta disabled={disableCta} />
    </div>
  )
}

export default Preview
