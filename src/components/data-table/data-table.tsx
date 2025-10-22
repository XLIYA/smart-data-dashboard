// src/components/data-table/data-table.tsx
import Card from '../ui/Card'
import { useMemo } from 'react'
import type { DataTableProps } from './types'
import DataTableHeader from './data-table-header'
import DataTableBody from './data-table-body'

const DataTable = ({ data, columns }: DataTableProps) => {
  const display = useMemo(() => (Array.isArray(data) ? data.slice(0, 100) : []), [data])
  return (
    <Card className="p-0 overflow-hidden">
      <div className="overflow-auto max-h-[600px] scrollbar">
        <table className="w-full text-sm table-fixed">
          <DataTableHeader columns={columns} />
          <DataTableBody data={display} columns={columns} />
        </table>
      </div>
      {Array.isArray(data) && data.length > 100 && (
        <div className="p-3 text-center text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-white/5 border-t border-gray-200 dark:border-white/10">
          Showing 100 of {data.length} rows
        </div>
      )}
    </Card>
  )
}
export default DataTable
