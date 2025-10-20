import { memo } from 'react'
import type { ColumnDef } from './types'
import { getTypeInfo } from './type-labels'

type Props = { columns: ColumnDef[] }

const DataTableHeader = ({ columns }: Props) => (
  <thead className="sticky top-0 z-10 bg-white/75 dark:bg-white/5 backdrop-blur-md border-b border-gray-200 dark:border-white/10">
    <tr>
      {columns.map((c) => {
        const typeInfo = getTypeInfo(c.type)
        return (
          <th key={c.name} className="px-4 py-3 text-left whitespace-nowrap">
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
)

export default memo(DataTableHeader)
