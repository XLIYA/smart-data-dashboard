import { memo } from 'react'
import type { ColumnDef } from './types'
import { formatCell } from './format-cell'

type Props = {
  data: any[]
  columns: ColumnDef[]
}

const DataTableBody = ({ data, columns }: Props) => (
  <tbody className="[&>tr>td]:border-b [&>tr>td]:border-gray-100 dark:[&>tr>td]:border-white/10">
    {data.map((row, ri) => (
      <tr key={ri} className="hover:bg-white/60 dark:hover:bg-white/5 transition-colors">
        {columns.map((c) => {
          const raw = row?.[c.name]
          const text = formatCell(raw)
          return (
            <td
              key={`${ri}-${c.name}`}
              className="px-4 py-3 text-gray-700 dark:text-gray-300 truncate"
              title={raw == null ? '' : String(raw)}
            >
              {text}
            </td>
          )
        })}
      </tr>
    ))}
  </tbody>
)

export default memo(DataTableBody)
