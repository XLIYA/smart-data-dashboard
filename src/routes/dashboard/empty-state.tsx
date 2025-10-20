import Card from '@/components/ui/Card'

export const EmptyState = () => (
  <Card className="p-12 text-center">
    <div className="space-y-3">
      <p className="text-lg text-gray-500 dark:text-gray-400">No charts yet</p>
      <p className="text-sm text-gray-400 dark:text-gray-500">
        Click "Add Chart" to create your first chart
      </p>
    </div>
  </Card>
)
