export type ColumnType = 'number' | 'string' | 'date' | 'boolean'

export const guessType = (vals: any[]): ColumnType => {
  const sample = vals.slice(0, 100).filter(v => v != null && String(v).trim() !== '')
  if (sample.length === 0) return 'string'

  const numCount = sample.filter(v => !Number.isNaN(Number(v))).length
  if (numCount / sample.length > 0.8) return 'number'

  const boolCount = sample.filter(v => {
    const s = String(v).toLowerCase()
    return s === 'true' || s === 'false' || v === true || v === false
  }).length
  if (boolCount / sample.length > 0.8) return 'boolean'

  const dateCount = sample.filter(v => /^\d{4}-\d{2}-\d{2}$/.test(String(v))).length
  if (dateCount / sample.length > 0.6) return 'date'

  return 'string'
}
