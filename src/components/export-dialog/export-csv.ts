// src/components/export-dialog/export-csv.ts

type CsvArgs = {
  data: any[]
  columns: Array<{ name: string }>
  includeBom?: boolean
}

const escapeCsv = (val: any): string => {
  if (val == null) return ''
  const s = String(val)
  const needsQuote = /[",\n\r]/.test(s)
  const escaped = s.replace(/"/g, '""')
  return needsQuote ? `"${escaped}"` : escaped
}

export const buildCsvBlob = ({ data, columns, includeBom = true }: CsvArgs) => {
  const header = columns.map(c => escapeCsv(c.name)).join(',')
  const rows = data.map(row =>
    columns.map(c => escapeCsv(row?.[c.name])).join(',')
  )
  const csv = [header, ...rows].join('\n')
  const bom = includeBom ? '\uFEFF' : '' // UTF-8 BOM برای Excel
  return new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' })
}
