// src/lib/data-mining.ts
import type { ColumnMeta } from '@/stores/dataStore'

export interface DataStatistics {
  totalRows: number
  totalColumns: number
  numericColumns: number
  categoricalColumns: number
  missingValues: number
  duplicateRows: number
}

export interface ColumnStats {
  name: string
  type: string
  count: number
  missing: number
  unique: number
  mean?: number
  median?: number
  std?: number
  min?: number
  max?: number
  mode?: any
  distribution?: { value: any; count: number }[]
}

export interface CorrelationPair {
  col1: string
  col2: string
  correlation: number
}

export interface OutlierInfo {
  column: string
  outliers: number[]
  count: number
}

/**
 * محاسبه آمار کلی دیتاست
 */
export const calculateStatistics = (
  data: any[],
  columns: ColumnMeta[]
): DataStatistics => {
  const numericColumns = columns.filter((c) => c.type === 'number').length
  const categoricalColumns = columns.filter((c) => c.type === 'string').length

  let missingValues = 0
  data.forEach((row) => {
    columns.forEach((col) => {
      if (row[col.name] == null || row[col.name] === '') missingValues++
    })
  })

  // تشخیص duplicate rows
  const uniqueRows = new Set(data.map((row) => JSON.stringify(row)))
  const duplicateRows = data.length - uniqueRows.size

  return {
    totalRows: data.length,
    totalColumns: columns.length,
    numericColumns,
    categoricalColumns,
    missingValues,
    duplicateRows,
  }
}

/**
 * محاسبه آمار تفصیلی هر ستون
 */
export const calculateColumnStats = (
  data: any[],
  columns: ColumnMeta[]
): ColumnStats[] => {
  return columns.map((col) => {
    const values = data
      .map((row) => row[col.name])
      .filter((v) => v != null && v !== '')
    const missing = data.length - values.length

    const stats: ColumnStats = {
      name: col.name,
      type: col.type,
      count: values.length,
      missing,
      unique: new Set(values).size,
    }

    // برای ستون‌های عددی
    if (col.type === 'number' && values.length > 0) {
      const numbers = values.map(Number).filter((n) => !isNaN(n))
      if (numbers.length > 0) {
        const sorted = [...numbers].sort((a, b) => a - b)
        const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length
        const median =
          numbers.length % 2 === 0
            ? (sorted[numbers.length / 2 - 1] + sorted[numbers.length / 2]) / 2
            : sorted[Math.floor(numbers.length / 2)]
        const variance =
          numbers.reduce((sum, n) => sum + Math.pow(n - mean, 2), 0) / numbers.length
        const std = Math.sqrt(variance)

        stats.mean = mean
        stats.median = median
        stats.std = std
        stats.min = Math.min(...numbers)
        stats.max = Math.max(...numbers)
      }
    }

    // توزیع مقادیر (برای categorical یا top 10)
    const freq = new Map<any, number>()
    values.forEach((v) => {
      freq.set(v, (freq.get(v) || 0) + 1)
    })
    const distribution = Array.from(freq.entries())
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    stats.distribution = distribution
    stats.mode = distribution[0]?.value

    return stats
  })
}

/**
 * محاسبه همبستگی بین ستون‌های عددی (Pearson Correlation)
 */
export const calculateCorrelations = (
  data: any[],
  columns: ColumnMeta[]
): CorrelationPair[] => {
  const numCols = columns.filter((c) => c.type === 'number')
  if (numCols.length < 2) return []

  const correlations: CorrelationPair[] = []

  for (let i = 0; i < numCols.length; i++) {
    for (let j = i + 1; j < numCols.length; j++) {
      const col1 = numCols[i].name
      const col2 = numCols[j].name

      const pairs = data
        .map((row) => [Number(row[col1]), Number(row[col2])])
        .filter(([a, b]) => !isNaN(a) && !isNaN(b))

      if (pairs.length < 2) continue

      const n = pairs.length
      const sum1 = pairs.reduce((s, [a]) => s + a, 0)
      const sum2 = pairs.reduce((s, [, b]) => s + b, 0)
      const sum1Sq = pairs.reduce((s, [a]) => s + a * a, 0)
      const sum2Sq = pairs.reduce((s, [, b]) => s + b * b, 0)
      const pSum = pairs.reduce((s, [a, b]) => s + a * b, 0)

      const num = pSum - (sum1 * sum2) / n
      const den = Math.sqrt((sum1Sq - (sum1 * sum1) / n) * (sum2Sq - (sum2 * sum2) / n))

      const correlation = den === 0 ? 0 : num / den

      correlations.push({
        col1,
        col2,
        correlation: Math.round(correlation * 1000) / 1000,
      })
    }
  }

  return correlations.sort(
    (a, b) => Math.abs(b.correlation) - Math.abs(a.correlation)
  )
}

/**
 * تشخیص Outliers با روش IQR (Interquartile Range)
 */
export const detectOutliers = (data: any[], columns: ColumnMeta[]): OutlierInfo[] => {
  const numCols = columns.filter((c) => c.type === 'number')
  const outliers: OutlierInfo[] = []

  numCols.forEach((col) => {
    const values = data
      .map((row) => Number(row[col.name]))
      .filter((n) => !isNaN(n))
      .sort((a, b) => a - b)

    if (values.length < 4) return

    const q1Index = Math.floor(values.length * 0.25)
    const q3Index = Math.floor(values.length * 0.75)
    const q1 = values[q1Index]
    const q3 = values[q3Index]
    const iqr = q3 - q1
    const lowerBound = q1 - 1.5 * iqr
    const upperBound = q3 + 1.5 * iqr

    const outlierValues = values.filter((v) => v < lowerBound || v > upperBound)

    if (outlierValues.length > 0) {
      outliers.push({
        column: col.name,
        outliers: outlierValues,
        count: outlierValues.length,
      })
    }
  })

  return outliers
}

/**
 * Recalculate outliers - برای استفاده بعد از data cleaning
 */
export const recalculateOutliers = (
  data: any[],
  columns: ColumnMeta[]
): OutlierInfo[] => {
  return detectOutliers(data, columns)
}