import Card from './ui/Card'

export default function DataTable({
  data,
  columns,
}: { data: any[]; columns: { name: string; type: string }[] }) {
  const display = data.slice(0, 100)

  const typeLabels: Record<string, { label: string; color: string }> = {
    number: { label: 'Number', color: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' },
    date: { label: 'Date', color: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' },
    boolean: { label: 'Boolean', color: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400' },
    string: { label: 'Text', color: 'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400' }
  }

  return (
    <Card className="p-0 overflow-hidden">
      <div className="overflow-auto max-h-[600px]">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 bg-white/75 dark:bg-white/5 backdrop-blur-md border-b border-gray-200 dark:border-white/10">
            <tr>
              {columns.map((c, i) => {
                const typeInfo = typeLabels[c.type] || typeLabels.string
                return (
                  <th key={i} className="px-4 py-3 text-left whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">{c.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeInfo.color}`}>
                        {typeInfo.label}
                      </span>
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody className="[&>tr>td]:border-b [&>tr>td]:border-gray-100 dark:[&>tr>td]:border-white/10">
            {display.map((row, ri) => (
              <tr key={ri} className="hover:bg-white/60 dark:hover:bg-white/5 transition-colors">
                {columns.map((c, ci) => (
                  <td key={ci} className="px-4 py-3 text-gray-700 dark:text-gray-300">
                    {formatCell(row[c.name])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length > 100 && (
        <div className="p-3 text-center text-sm text-gray-600 dark:text-gray-400 bg-white/40 dark:bg-white/5 border-t border-gray-200 dark:border-white/10">
          Showing 100 of {data.length} rows
        </div>
      )}
    </Card>
  )
}

function formatCell(v: any) {
  if (v == null || v === '') return '—'
  return String(v).substring(0, 50)
}