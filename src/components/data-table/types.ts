// src/components/data-table/types.ts
export type ColumnDef = { name: string; type: string }

export type DataTableProps = {
  data: any[]
  columns: ColumnDef[]
}
