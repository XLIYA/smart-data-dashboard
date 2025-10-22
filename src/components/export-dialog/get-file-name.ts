// src/components/export-dialog/get-file-name.ts

export const getFileName = (ext: string) => {
  const date = new Date().toISOString().split('T')[0] // YYYY-MM-DD
  return `export-${date}.${ext}`
}
