// src/components/upload-dropzone/infer-columns.ts
import { guessType } from './guess-type'
import type { ColumnMeta } from '@/stores/dataStore'

export const inferColumns = (rows: Record<string, any>[]): ColumnMeta[] => {
  const keys = Object.keys(rows[0] ?? {})
  return keys.map((name) => ({
    name,
    type: guessType(rows.map((r) => r?.[name])),
  }))
}