export const getThemeColors = (isDark: boolean) => ({
  textColor: isDark ? '#f3f4f6' : '#374151',
  gridColor: isDark ? '#4b5563' : '#e5e7eb',
  bgColor: isDark ? '#1f2937' : '#fff',
  borderColor: isDark ? '#374151' : '#e5e7eb',
  primaryColor: isDark ? '#22d3ee' : '#0891b2',
  primaryLight: isDark ? 'rgba(34, 211, 238, 0.15)' : 'rgba(8, 145, 178, 0.1)',
  gradientStart: '#06b6d4',
  gradientEnd: '#0d9488',
})
