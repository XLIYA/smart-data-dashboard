// src/routes/dashboard/stats-panel.tsx
import { useMemo, useEffect, useState } from 'react'
import Card from '@/components/ui/Card'
import {
  calculateStatistics,
  calculateColumnStats,
  calculateCorrelations,
  detectOutliers,
} from '@/lib/data-mining'
import type { ColumnMeta } from '@/stores/dataStore'
import {
  Database,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  Activity,
  Zap,
} from 'lucide-react'

interface Props {
  data: any[]
  columns: ColumnMeta[]
}

export const StatsPanel = ({ data, columns }: Props) => {
  const stats = useMemo(() => calculateStatistics(data, columns), [data, columns])
  const columnStats = useMemo(() => calculateColumnStats(data, columns), [data, columns])
  const correlations = useMemo(
    () => calculateCorrelations(data, columns).slice(0, 3),
    [data, columns]
  )
  
  // ✅ استفاده از useState برای force update
  const [outliers, setOutliers] = useState(() => detectOutliers(data, columns))

  // ✅ Update outliers وقتی data تغییر می‌کند
  useEffect(() => {
    setOutliers(detectOutliers(data, columns))
  }, [data, columns])

  const StatCard = ({
    icon: Icon,
    label,
    value,
    color,
  }: {
    icon: any
    label: string
    value: string | number
    color: string
  }) => (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-white/80 to-white/40 dark:from-white/5 dark:to-white/[0.02] border border-gray-200/50 dark:border-white/10 backdrop-blur-sm">
      <div className={`p-2.5 rounded-lg ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">{label}</p>
        <p className="text-lg font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-5 h-5 text-accent-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Dataset Overview
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard
            icon={BarChart3}
            label="Total Rows"
            value={stats.totalRows.toLocaleString()}
            color="bg-blue-500/15 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
          />
          <StatCard
            icon={TrendingUp}
            label="Columns"
            value={stats.totalColumns}
            color="bg-green-500/15 text-green-600 dark:bg-green-500/20 dark:text-green-400"
          />
          <StatCard
            icon={Activity}
            label="Numeric"
            value={stats.numericColumns}
            color="bg-purple-500/15 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400"
          />
          <StatCard
            icon={Zap}
            label="Categorical"
            value={stats.categoricalColumns}
            color="bg-yellow-500/15 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400"
          />
          <StatCard
            icon={AlertTriangle}
            label="Missing"
            value={stats.missingValues}
            color="bg-orange-500/15 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400"
          />
          <StatCard
            icon={Database}
            label="Duplicates"
            value={stats.duplicateRows}
            color="bg-red-500/15 text-red-600 dark:bg-red-500/20 dark:text-red-400"
          />
        </div>
      </Card>

      {/* Detailed Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Column Statistics */}
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-accent-500" />
            Column Statistics
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto scrollbar">
            {columnStats.slice(0, 5).map((col) => (
              <div
                key={col.name}
                className="p-3 rounded-lg bg-gray-50/80 dark:bg-white/5 border border-gray-200/50 dark:border-white/10"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">
                    {col.name}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent-500/20 text-accent-700 dark:text-accent-300">
                    {col.type}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <span>Unique: {col.unique}</span>
                  {col.mean !== undefined && <span>Mean: {col.mean.toFixed(2)}</span>}
                  {col.missing > 0 && (
                    <span className="text-orange-600 dark:text-orange-400">
                      Missing: {col.missing}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Correlations */}
        {correlations.length > 0 && (
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-accent-500" />
              Top Correlations
            </h3>
            <div className="space-y-2">
              {correlations.map((corr, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-gray-50/80 dark:bg-white/5 border border-gray-200/50 dark:border-white/10"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-gray-800 dark:text-gray-200">
                      {corr.col1} ↔ {corr.col2}
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        Math.abs(corr.correlation) > 0.7
                          ? 'text-green-600 dark:text-green-400'
                          : Math.abs(corr.correlation) > 0.4
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {corr.correlation.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${
                        Math.abs(corr.correlation) > 0.7
                          ? 'bg-green-500'
                          : Math.abs(corr.correlation) > 0.4
                          ? 'bg-yellow-500'
                          : 'bg-gray-400'
                      }`}
                      style={{ width: `${Math.abs(corr.correlation) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Outliers */}
        {outliers.length > 0 && (
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              Outliers Detected
            </h3>
            <div className="space-y-2">
              {outliers.slice(0, 4).map((out, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-orange-50/80 dark:bg-orange-500/10 border border-orange-200/50 dark:border-orange-500/20"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">
                      {out.column}
                    </span>
                    <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                      {out.count} outliers
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-600 dark:text-gray-400 mt-1 truncate">
                    Range: {Math.min(...out.outliers).toFixed(2)} to{' '}
                    {Math.max(...out.outliers).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}