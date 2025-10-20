export type ExportDialogProps = {
  open: boolean
  onClose: () => void
  data: any[]
  columns: Array<{ name: string; [k: string]: any }>
}
