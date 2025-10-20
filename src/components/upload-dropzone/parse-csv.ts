// CSV parser with quotes, commas, newlines inside quotes
export const parseCsv = (text: string): Record<string, any>[] => {
  if (!text) return []
  const rows: string[][] = []
  let cur = ''
  let row: string[] = []
  let inQuotes = false

  const pushCell = () => { row.push(cur); cur = '' }
  const pushRow = () => { rows.push(row); row = [] }

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (ch === '"') {
      if (inQuotes && text[i + 1] === '"') { cur += '"'; i++ }
      else inQuotes = !inQuotes
    } else if (ch === ',' && !inQuotes) {
      pushCell()
    } else if ((ch === '\n' || ch === '\r') && !inQuotes) {
      // normalize CRLF / LF
      if (ch === '\r' && text[i + 1] === '\n') i++
      pushCell()
      if (row.length && row.some(c => c !== '')) pushRow()
    } else {
      cur += ch
    }
  }
  // flush tail
  pushCell()
  if (row.length && row.some(c => c !== '')) pushRow()

  if (rows.length === 0) return []

  const headers = rows[0].map(h => h.trim())
  const dataRows = rows.slice(1)

  return dataRows.map(r => {
    const obj: Record<string, any> = {}
    headers.forEach((h, i) => { obj[h] = (r[i] ?? '').trim() })
    return obj
  })
}
