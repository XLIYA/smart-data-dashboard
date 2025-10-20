import { useCallback, useState } from 'react'

export const useDnd = () => {
  const [drag, setDrag] = useState(false)

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDrag(true)
  }, [])

  const onDragLeave = useCallback(() => setDrag(false), [])

  const onDrop = useCallback(
    (e: React.DragEvent, cb: (file: File) => void) => {
      e.preventDefault()
      setDrag(false)
      const f = e.dataTransfer.files?.[0]
      if (f) cb(f)
    },
    []
  )

  return { drag, onDragOver, onDragLeave, onDrop }
}
