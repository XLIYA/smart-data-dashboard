type LabelInfo = { label: string; color: string }

const map: Record<string, LabelInfo> = {
  number: {
    label: 'Number',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
  },
  date: {
    label: 'Date',
    color: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400',
  },
  boolean: {
    label: 'Boolean',
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400',
  },
  string: {
    label: 'Text',
    color: 'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400',
  },
}

export const getTypeInfo = (t?: string): LabelInfo => map[t ?? 'string'] ?? map.string
