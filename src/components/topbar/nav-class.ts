export const navClass = (active: boolean): string =>
  `p-2.5 rounded-xl transition-all duration-300 ${
    active
      ? 'bg-accent-500/20 text-accent-600 dark:text-accent-400 shadow-md ring-1 ring-accent-500/30'
      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-white/8 hover:text-gray-900 dark:hover:text-white'
  }`
