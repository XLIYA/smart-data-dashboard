import Modal from './ui/Modal'
import Button from './ui/Button'
import { Trash2 } from 'lucide-react'

type Props = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

const ConfirmDeleteModal = ({ open, onClose, onConfirm }: Props) => {
  if (!open) return null
  return (
    <Modal open={open} onClose={onClose} title="Delete Chart">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-red-500/15 text-red-600">
            <Trash2 className="w-5 h-5" />
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Are you sure you want to delete this chart? This action cannot be undone.
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition"
          >
            Cancel
          </button>
          <Button onClick={onConfirm} className="bg-red-600 hover:bg-red-700">
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmDeleteModal
