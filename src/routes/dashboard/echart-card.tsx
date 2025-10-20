import { memo, useEffect, useRef } from 'react'
import { initChart } from '@/lib/echarts'

type Props = { option: any; className?: string }

export const EChartCard = memo(({ option, className = 'h-[300px] lg:h-[400px]' }: Props) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const inst = initChart(ref.current)
    inst.setOption(option, true)

    const handleResize = () => inst.resize()

    // ResizeObserver → دقیق‌تر از window.resize
    const ro = new ResizeObserver(() => handleResize())
    ro.observe(ref.current)

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      ro.disconnect()
      inst.dispose()
    }
  }, [option])

  return <div ref={ref} className={className} />
})
