import UploadDropzone from '@/components/UploadDropzone'
import { ArrowRight, BarChart3, Zap, Download } from 'lucide-react'

export default function Landing() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-6 pt-8">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          Transform data into
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-accent-500 to-cyan-500">
            stunning visuals
          </span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Upload your CSV file and instantly create interactive charts and dashboards.
          No coding required. Start visualizing in seconds.
        </p>
      </div>

      {/* Upload Section */}
      <div className="max-w-2xl mx-auto w-full">
        <UploadDropzone />
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="p-6 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5">
          <BarChart3 className="w-8 h-8 text-accent-500 mb-3" />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Multiple Charts</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Create bar, line, pie and more chart types
          </p>
        </div>

        <div className="p-6 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5">
          <Zap className="w-8 h-8 text-accent-500 mb-3" />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Lightning Fast</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Instant preview and visualization of your data
          </p>
        </div>

        <div className="p-6 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5">
          <Download className="w-8 h-8 text-accent-500 mb-3" />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Export Ready</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Download your dashboard as PDF or image
          </p>
        </div>
      </div>
    </div>
  )
}