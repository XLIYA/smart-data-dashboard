import { useEffect, useRef } from 'react'

export const useDarkModeRef = () => {
  const isDarkRef = useRef<boolean>(false)

  useEffect(() => {
    const el = document.documentElement
    const compute = () => { isDarkRef.current = el.classList.contains('dark') }
    compute()

    const observer = new MutationObserver(() => compute())
    observer.observe(el, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return isDarkRef
}
