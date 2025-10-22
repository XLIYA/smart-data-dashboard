// src/components/export-dialog/types.ts
import type { ColumnMeta } from '@/stores/dataStore'

export type ExportDialogProps = {
  open: boolean
  onClose: () => void
  data: any[]
  columns: ColumnMeta[]  // ✅ استفاده از ColumnMeta
}