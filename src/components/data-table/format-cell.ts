export const formatCell = (v: any): string => {
  if (v == null || v === '') return '—'
  return String(v).substring(0, 50)
}
