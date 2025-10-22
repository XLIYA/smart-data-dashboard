// src/components/data-cleaning-dialog.tsx
import { useState } from 'react'
import Modal from './ui/Modal'
import Button from './ui/Button'
import { useToast } from './ui/toast'
import { CheckCircle, AlertCircle, Sparkles, Info } from 'lucide-react'
import { cleanData, type CleaningOptions, type CleaningResult } from '@/lib/data-cleaning'
import type { ColumnMeta } from '@/stores/dataStore'

interface DataCleaningDialogProps {
  open: boolean
  onClose: () => void
  data: any[]
  columns: ColumnMeta[]
  onApply: (cleanedData: any[], report: CleaningResult['report']) => void
}

const DataCleaningDialog = ({ open, onClose, data, columns, onApply }: DataCleaningDialogProps) => {
  const { showToast } = useToast()
  const [options, setOptions] = useState<CleaningOptions>({
    removeDuplicates: true,
    removeEmptyRows: true,
    fillMissingValues: true,
    fillMethod: 'mean',
    trimStrings: true,
    removeOutliers: false,
    outlierMethod: 'iqr',
    normalizeNumbers: false,
  })

  const [previewResult, setPreviewResult] = useState<CleaningResult | null>(null)
  const [isPreview, setIsPreview] = useState(false)

  const handlePreview = () => {
    try {
      const result = cleanData(data, columns, options)
      setPreviewResult(result)
      setIsPreview(true)
      showToast('success', 'Preview Generated', 'Review the cleaning results before applying')
    } catch (error) {
      showToast('error', 'Preview Failed', 'An error occurred while generating preview')
      console.error(error)
    }
  }

  const handleApply = () => {
    if (previewResult) {
      onApply(previewResult.cleanedData, previewResult.report)
      showToast(
        'success',
        'Data Cleaned Successfully',
        `${previewResult.report.changes.length} operations completed\n${previewResult.report.removedRows} rows removed`
      )
      onClose()
    }
  }

  const toggleOption = (key: keyof CleaningOptions) => {
    setOptions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
    setIsPreview(false)
  }

  const setFillMethod = (method: 'mean' | 'median' | 'mode' | 'zero' | 'remove') => {
    setOptions((prev) => ({ ...prev, fillMethod: method }))
    setIsPreview(false)
  }

  const setOutlierMethod = (method: 'iqr' | 'zscore') => {
    setOptions((prev) => ({ ...prev, outlierMethod: method }))
    setIsPreview(false)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20">
            <Sparkles className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <h3 className="text-base font-semibold">Data Cleaning</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-normal">
              Clean and prepare your data for analysis
            </p>
          </div>
        </div>
      }
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">
        {/* Cleaning Options */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            <Info className="w-4 h-4 text-accent-500" />
            Cleaning Options
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Remove Duplicates */}
            <label className="flex items-start gap-3 p-3 rounded-lg border-2 border-gray-200 dark:border-white/10 cursor-pointer hover:border-accent-400 transition-colors">
              <input
                type="checkbox"
                checked={options.removeDuplicates}
                onChange={() => toggleOption('removeDuplicates')}
                className="mt-0.5 w-4 h-4 text-accent-500 rounded focus:ring-2 focus:ring-accent-400"
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  Remove Duplicates
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Delete identical rows from dataset
                </div>
              </div>
            </label>

            {/* Remove Empty Rows */}
            <label className="flex items-start gap-3 p-3 rounded-lg border-2 border-gray-200 dark:border-white/10 cursor-pointer hover:border-accent-400 transition-colors">
              <input
                type="checkbox"
                checked={options.removeEmptyRows}
                onChange={() => toggleOption('removeEmptyRows')}
                className="mt-0.5 w-4 h-4 text-accent-500 rounded focus:ring-2 focus:ring-accent-400"
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  Remove Empty Rows
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Delete rows with all empty values
                </div>
              </div>
            </label>

            {/* Trim Strings */}
            <label className="flex items-start gap-3 p-3 rounded-lg border-2 border-gray-200 dark:border-white/10 cursor-pointer hover:border-accent-400 transition-colors">
              <input
                type="checkbox"
                checked={options.trimStrings}
                onChange={() => toggleOption('trimStrings')}
                className="mt-0.5 w-4 h-4 text-accent-500 rounded focus:ring-2 focus:ring-accent-400"
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  Trim Whitespace
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Remove leading/trailing spaces
                </div>
              </div>
            </label>

            {/* Fill Missing Values */}
            <label className="flex items-start gap-3 p-3 rounded-lg border-2 border-gray-200 dark:border-white/10 cursor-pointer hover:border-accent-400 transition-colors">
              <input
                type="checkbox"
                checked={options.fillMissingValues}
                onChange={() => toggleOption('fillMissingValues')}
                className="mt-0.5 w-4 h-4 text-accent-500 rounded focus:ring-2 focus:ring-accent-400"
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  Fill Missing Values
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Replace null/empty values
                </div>
              </div>
            </label>

            {/* Remove Outliers */}
            <label className="flex items-start gap-3 p-3 rounded-lg border-2 border-gray-200 dark:border-white/10 cursor-pointer hover:border-accent-400 transition-colors">
              <input
                type="checkbox"
                checked={options.removeOutliers}
                onChange={() => toggleOption('removeOutliers')}
                className="mt-0.5 w-4 h-4 text-accent-500 rounded focus:ring-2 focus:ring-accent-400"
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  Remove Outliers
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Delete statistical outliers
                </div>
              </div>
            </label>

            {/* Normalize Numbers */}
            <label className="flex items-start gap-3 p-3 rounded-lg border-2 border-gray-200 dark:border-white/10 cursor-pointer hover:border-accent-400 transition-colors">
              <input
                type="checkbox"
                checked={options.normalizeNumbers}
                onChange={() => toggleOption('normalizeNumbers')}
                className="mt-0.5 w-4 h-4 text-accent-500 rounded focus:ring-2 focus:ring-accent-400"
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  Normalize Numbers
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Scale values to 0-1 range
                </div>
              </div>
            </label>
          </div>

          {/* Advanced Options */}
          {options.fillMissingValues && (
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-2">
                Fill Method for Missing Values
              </label>
              <div className="flex flex-wrap gap-2">
                {(['mean', 'median', 'mode', 'zero'] as const).map((method) => (
                  <button
                    key={method}
                    onClick={() => setFillMethod(method)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border-2 transition-colors ${
                      options.fillMethod === method
                        ? 'border-accent-500 bg-accent-500/10 text-accent-600 dark:text-accent-400'
                        : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {method.charAt(0).toUpperCase() + method.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {options.removeOutliers && (
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-2">
                Outlier Detection Method
              </label>
              <div className="flex gap-2">
                {(['iqr', 'zscore'] as const).map((method) => (
                  <button
                    key={method}
                    onClick={() => setOutlierMethod(method)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border-2 transition-colors ${
                      options.outlierMethod === method
                        ? 'border-accent-500 bg-accent-500/10 text-accent-600 dark:text-accent-400'
                        : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {method === 'iqr' ? 'IQR Method' : 'Z-Score'}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Preview Results */}
        {isPreview && previewResult && (
          <div className="p-4 rounded-lg bg-green-50 dark:bg-green-500/10 border-2 border-green-200 dark:border-green-500/30">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-green-900 dark:text-green-100 mb-2">
                  Cleaning Preview
                </h4>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <div className="text-xs text-green-700 dark:text-green-300">Original Rows</div>
                    <div className="text-lg font-bold text-green-900 dark:text-green-100">
                      {previewResult.report.originalRows.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-green-700 dark:text-green-300">Cleaned Rows</div>
                    <div className="text-lg font-bold text-green-900 dark:text-green-100">
                      {previewResult.report.cleanedRows.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-green-700 dark:text-green-300">Rows Removed</div>
                    <div className="text-lg font-bold text-green-900 dark:text-green-100">
                      {previewResult.report.removedRows.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-green-700 dark:text-green-300">Values Filled</div>
                    <div className="text-lg font-bold text-green-900 dark:text-green-100">
                      {previewResult.report.missingValuesFilled.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-green-800 dark:text-green-200 mb-1">
                    Operations Applied:
                  </div>
                  {previewResult.report.changes.map((change, i) => (
                    <div key={i} className="text-xs text-green-700 dark:text-green-300 flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                      <span>{change}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-gray-200 dark:border-white/10">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border-2 border-gray-200 dark:border-white/10 
              text-gray-700 dark:text-gray-300 font-medium transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
          >
            Cancel
          </button>
          <div className="flex gap-2">
            <Button
              onClick={handlePreview}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4" />
              Preview
            </Button>
            <Button
              onClick={handleApply}
              disabled={!isPreview}
              className="flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle className="w-4 h-4" />
              Apply Changes
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default DataCleaningDialog