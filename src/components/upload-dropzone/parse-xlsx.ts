// Dynamic import to avoid bundling cost unless needed
export const parseXlsx = async (file: File): Promise<Record<string, any>[]> => {
  const { default: XLSX } = await import('xlsx') // نیاز به `npm i xlsx`
  const buf = await file.arrayBuffer()
  const wb = XLSX.read(buf)
  const ws = wb.Sheets[wb.SheetNames[0]]
  // defval: '' to keep empty cells explicit
  return XLSX.utils.sheet_to_json(ws, { defval: '' }) as Record<string, any>[]
}
