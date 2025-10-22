// src/lib/data-cleaning.ts
import type { ColumnMeta } from '@/stores/dataStore'

export interface CleaningOptions {
  removeDuplicates?: boolean
  removeEmptyRows?: boolean
  fillMissingValues?: boolean
  fillMethod?: 'mean' | 'median' | 'mode' | 'zero' | 'remove'
  trimStrings?: boolean
  removeOutliers?: boolean
  outlierMethod?: 'iqr' | 'zscore'
  normalizeNumbers?: boolean
}

export interface CleaningResult {
  cleanedData: any[]
  report: {
    originalRows: number
    cleanedRows: number
    removedRows: number
    duplicatesRemoved: number
    missingValuesFilled: number
    outliersRemoved: number
    changes: string[]
  }
}

export const cleanData = (
  data: any[],
  columns: ColumnMeta[],
  options: CleaningOptions = {}
): CleaningResult => {
  const {
    removeDuplicates = true,
    removeEmptyRows = true,
    fillMissingValues = true,
    fillMethod = 'mean',
    trimStrings = true,
    removeOutliers = false,
    outlierMethod = 'iqr',
    normalizeNumbers = false,
  } = options

  let cleaned = [...data]
  const changes: string[] = []
  const originalRows = cleaned.length
  let duplicatesRemoved = 0
  let missingValuesFilled = 0
  let outliersRemoved = 0

  // 1. Remove duplicates
  if (removeDuplicates) {
    const uniqueRows = new Set(cleaned.map((row) => JSON.stringify(row)))
    duplicatesRemoved = cleaned.length - uniqueRows.size
    cleaned = Array.from(uniqueRows).map((row) => JSON.parse(row))
    if (duplicatesRemoved > 0) {
      changes.push(`Removed ${duplicatesRemoved} duplicate rows`)
    }
  }

  // 2. Trim strings
  if (trimStrings) {
    cleaned = cleaned.map((row) => {
      const trimmedRow = { ...row }
      columns.forEach((col) => {
        if (col.type === 'string' && typeof trimmedRow[col.name] === 'string') {
          trimmedRow[col.name] = trimmedRow[col.name].trim()
        }
      })
      return trimmedRow
    })
    changes.push('Trimmed whitespace from string columns')
  }

  // 3. Handle missing values
  if (fillMissingValues) {
    columns.forEach((col) => {
      const values = cleaned
        .map((row) => row[col.name])
        .filter((v) => v != null && v !== '')

      if (values.length === 0) return

      let fillValue: any = null

      if (col.type === 'number') {
        const numbers = values.map(Number).filter((n) => !isNaN(n))
        if (numbers.length === 0) return

        if (fillMethod === 'mean') {
          fillValue = numbers.reduce((a, b) => a + b, 0) / numbers.length
        } else if (fillMethod === 'median') {
          const sorted = [...numbers].sort((a, b) => a - b)
          fillValue =
            numbers.length % 2 === 0
              ? (sorted[numbers.length / 2 - 1] + sorted[numbers.length / 2]) / 2
              : sorted[Math.floor(numbers.length / 2)]
        } else if (fillMethod === 'zero') {
          fillValue = 0
        }
      } else if (col.type === 'string' && fillMethod === 'mode') {
        // Find mode (most frequent value)
        const freq = new Map<string, number>()
        values.forEach((v) => {
          freq.set(v, (freq.get(v) || 0) + 1)
        })
        fillValue = Array.from(freq.entries()).sort((a, b) => b[1] - a[1])[0]?.[0]
      }

      if (fillValue != null) {
        cleaned.forEach((row) => {
          if (row[col.name] == null || row[col.name] === '') {
            row[col.name] = fillValue
            missingValuesFilled++
          }
        })
      }
    })

    if (missingValuesFilled > 0) {
      changes.push(`Filled ${missingValuesFilled} missing values using ${fillMethod} method`)
    }
  }

  // 4. Remove empty rows
  if (removeEmptyRows) {
    const beforeCount = cleaned.length
    cleaned = cleaned.filter((row) => {
      return columns.some((col) => {
        const val = row[col.name]
        return val != null && val !== ''
      })
    })
    const emptyRowsRemoved = beforeCount - cleaned.length
    if (emptyRowsRemoved > 0) {
      changes.push(`Removed ${emptyRowsRemoved} empty rows`)
    }
  }

  // 5. Remove outliers
  if (removeOutliers) {
    const numericColumns = columns.filter((c) => c.type === 'number')

    numericColumns.forEach((col) => {
      const values = cleaned
        .map((row) => Number(row[col.name]))
        .filter((n) => !isNaN(n))
        .sort((a, b) => a - b)

      if (values.length < 4) return

      let lowerBound: number
      let upperBound: number

      if (outlierMethod === 'iqr') {
        const q1Index = Math.floor(values.length * 0.25)
        const q3Index = Math.floor(values.length * 0.75)
        const q1 = values[q1Index]
        const q3 = values[q3Index]
        const iqr = q3 - q1
        lowerBound = q1 - 1.5 * iqr
        upperBound = q3 + 1.5 * iqr
      } else {
        // z-score method
        const mean = values.reduce((a, b) => a + b, 0) / values.length
        const std = Math.sqrt(
          values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length
        )
        lowerBound = mean - 3 * std
        upperBound = mean + 3 * std
      }

      const beforeCount = cleaned.length
      cleaned = cleaned.filter((row) => {
        const val = Number(row[col.name])
        return isNaN(val) || (val >= lowerBound && val <= upperBound)
      })
      const removed = beforeCount - cleaned.length
      outliersRemoved += removed
    })

    if (outliersRemoved > 0) {
      changes.push(`Removed ${outliersRemoved} outlier rows using ${outlierMethod} method`)
    }
  }

  // 6. Normalize numbers (optional)
  if (normalizeNumbers) {
    const numericColumns = columns.filter((c) => c.type === 'number')

    numericColumns.forEach((col) => {
      const values = cleaned
        .map((row) => Number(row[col.name]))
        .filter((n) => !isNaN(n))

      if (values.length === 0) return

      const min = Math.min(...values)
      const max = Math.max(...values)
      const range = max - min

      if (range === 0) return

      cleaned.forEach((row) => {
        const val = Number(row[col.name])
        if (!isNaN(val)) {
          row[col.name] = Number(((val - min) / range).toFixed(4))
        }
      })
    })

    changes.push('Normalized numeric columns to 0-1 range')
  }

  return {
    cleanedData: cleaned,
    report: {
      originalRows,
      cleanedRows: cleaned.length,
      removedRows: originalRows - cleaned.length,
      duplicatesRemoved,
      missingValuesFilled,
      outliersRemoved,
      changes,
    },
  }
}