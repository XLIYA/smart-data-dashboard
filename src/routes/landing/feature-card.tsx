import { type ElementType } from 'react'

type Props = {
  icon: ElementType
  title: string
  desc: string
}

export const FeatureCard = ({ icon: Icon, title, desc }: Props) => (
  <div className="p-6 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5">
    <Icon className="w-8 h-8 text-accent-500 mb-3" aria-hidden="true" />
    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
  </div>
)
