// src/routes/preview/quick-insights.tsx
import { useMemo } from 'react'
import Card from '@/components/ui/Card'
import { calculateStatistics } from '@/lib/data-mining'
import type { ColumnMeta } from '@/stores/dataStore'
import { CheckCircle, AlertCircle, TrendingUp, Database } from 'lucide-react'

interface Props {
  data: any[]
  columns: ColumnMeta[]
}

export const QuickInsights = ({ data, columns }: Props) => {
  const stats = useMemo(() => calculateStatistics(data, columns), [data, columns])

  const insights = [
    {
      icon: Database,
      label: 'Data Quality',
      value: `${((1 - stats.missingValues / (stats.totalRows * stats.totalColumns)) * 100).toFixed(1)}%`,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-500/15 dark:bg-blue-500/20',
    },
    {
      icon: CheckCircle,
      label: 'Complete Rows',
      value: `${stats.totalRows - stats.duplicateRows}`,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-500/15 dark:bg-green-500/20',
    },
    {
      icon: TrendingUp,
      label: 'Numeric Columns',
      value: `${stats.numericColumns}/${stats.totalColumns}`,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-500/15 dark:bg-purple-500/20',
    },
    {
      icon: AlertCircle,
      label: 'Issues Found',
      value: stats.missingValues + stats.duplicateRows,
      color: 'text-orange-600 dark:text-orange-400',
      bg: 'bg-orange-500/15 dark:bg-orange-500/20',
    },
  ]

  return (
    <Card className="p-5">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-accent-500" />
        Quick Insights
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {insights.map((insight, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 rounded-lg bg-white/60 dark:bg-white/5 border border-gray-200/50 dark:border-white/10"
          >
            <div className={`p-2 rounded-lg ${insight.bg}`}>
              <insight.icon className={`w-4 h-4 ${insight.color}`} />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">{insight.label}</p>
              <p className={`text-base font-bold ${insight.color}`}>{insight.value}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}