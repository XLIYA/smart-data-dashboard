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
          <th key={c.name} className="px-4 py-2 text-left align-bottom">
            <div className="flex flex-col items-start leading-tight gap-1">
              <span className="font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">
                {c.name}
              </span>
              <span
                className={`inline-flex items-center rounded-md text-[10px] px-1.5 py-0.5 font-medium ${typeInfo.color}`}
              >
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
