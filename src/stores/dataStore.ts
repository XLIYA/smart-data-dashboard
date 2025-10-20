// ------------------------------
// src/stores/dataStore.ts
// ------------------------------
import { create } from 'zustand'

export type ColumnType = 'number'|'string'|'date'|'boolean'
export type ColumnMeta = { name: string; type: ColumnType }
export type Insight = { id: string; title: string; snippet: string; severity: 'info'|'warn'|'critical' }

interface DataState {
  file?: { name: string; size: number; type: string }
  rows: number
  columns: ColumnMeta[]
  data: any[]
  insights: Insight[]
  setData: (p: Partial<DataState>) => void
  reset: () => void
}

export const useDataStore = create<DataState>((set) => ({
  rows: 0,
  columns: [],
  data: [],
  insights: [],
  setData: (p) => set(p),
  reset: () => set({ rows: 0, columns: [], data: [], insights: [], file: undefined })
}))
