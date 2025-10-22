// src/components/export-dialog/export-json.ts

type JsonArgs = {
  data: any[]
  columns: any[]
  space?: number
}

export const buildJsonBlob = ({ data, columns, space = 2 }: JsonArgs) => {
  const payload = { columns, data }
  const json = JSON.stringify(payload, null, space)
  return new Blob([json], { type: 'application/json' })
}
