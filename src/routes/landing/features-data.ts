import { BarChart3, Zap, Download } from 'lucide-react'

export type FeatureItem = {
  icon: any
  title: string
  desc: string
}

export const getFeatures = (): FeatureItem[] => ([
  {
    icon: BarChart3,
    title: 'Multiple Charts',
    desc: 'Create bar, line, and scatter charts in seconds.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    desc: 'Instant preview and smooth interactions.',
  },
  {
    icon: Download,
    title: 'Export Ready',
    // هماهنگ با قابلیت فعلی پروژه (CSV/JSON)
    desc: 'Download your data as CSV or JSON.',
  },
])
