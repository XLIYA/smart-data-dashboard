// src/components/chart-builder/get-theme-colors.ts
import type { ColorScheme } from './chart-types'

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

export const getColorScheme = (scheme: ColorScheme, isDark: boolean) => {
  const schemes = {
    default: {
      primary: isDark ? '#22d3ee' : '#0891b2',
      secondary: isDark ? '#0d9488' : '#14b8a6',
      shadow: isDark ? 'rgba(34, 211, 238, 0.4)' : 'rgba(8, 145, 178, 0.3)',
      gradient: {
        type: 'linear' as const,
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          { offset: 0, color: '#06b6d4' },
          { offset: 1, color: '#0d9488' },
        ],
      },
      areaGradient: {
        type: 'linear' as const,
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          { offset: 0, color: isDark ? 'rgba(34, 211, 238, 0.4)' : 'rgba(6, 182, 212, 0.4)' },
          { offset: 1, color: 'transparent' },
        ],
      },
      palette: [
        '#06b6d4',
        '#0d9488',
        '#14b8a6',
        '#22d3ee',
        '#2dd4bf',
        '#5eead4',
        '#99f6e4',
        '#0891b2',
        '#0f766e',
        '#115e59',
      ],
    },
    vibrant: {
      primary: isDark ? '#f472b6' : '#ec4899',
      secondary: isDark ? '#a855f7' : '#9333ea',
      shadow: isDark ? 'rgba(244, 114, 182, 0.4)' : 'rgba(236, 72, 153, 0.3)',
      gradient: {
        type: 'linear' as const,
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          { offset: 0, color: '#ec4899' },
          { offset: 1, color: '#a855f7' },
        ],
      },
      areaGradient: {
        type: 'linear' as const,
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          { offset: 0, color: isDark ? 'rgba(244, 114, 182, 0.4)' : 'rgba(236, 72, 153, 0.4)' },
          { offset: 1, color: 'transparent' },
        ],
      },
      palette: [
        '#ec4899',
        '#a855f7',
        '#f472b6',
        '#c026d3',
        '#e879f9',
        '#d946ef',
        '#f0abfc',
        '#db2777',
        '#9333ea',
        '#7e22ce',
      ],
    },
    cool: {
      primary: isDark ? '#60a5fa' : '#3b82f6',
      secondary: isDark ? '#818cf8' : '#6366f1',
      shadow: isDark ? 'rgba(96, 165, 250, 0.4)' : 'rgba(59, 130, 246, 0.3)',
      gradient: {
        type: 'linear' as const,
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          { offset: 0, color: '#3b82f6' },
          { offset: 1, color: '#6366f1' },
        ],
      },
      areaGradient: {
        type: 'linear' as const,
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          { offset: 0, color: isDark ? 'rgba(96, 165, 250, 0.4)' : 'rgba(59, 130, 246, 0.4)' },
          { offset: 1, color: 'transparent' },
        ],
      },
      palette: [
        '#3b82f6',
        '#6366f1',
        '#60a5fa',
        '#4f46e5',
        '#818cf8',
        '#8b5cf6',
        '#a78bfa',
        '#2563eb',
        '#4338ca',
        '#3730a3',
      ],
    },
    warm: {
      primary: isDark ? '#fb923c' : '#f97316',
      secondary: isDark ? '#ef4444' : '#dc2626',
      shadow: isDark ? 'rgba(251, 146, 60, 0.4)' : 'rgba(249, 115, 22, 0.3)',
      gradient: {
        type: 'linear' as const,
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          { offset: 0, color: '#f97316' },
          { offset: 1, color: '#ef4444' },
        ],
      },
      areaGradient: {
        type: 'linear' as const,
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          { offset: 0, color: isDark ? 'rgba(251, 146, 60, 0.4)' : 'rgba(249, 115, 22, 0.4)' },
          { offset: 1, color: 'transparent' },
        ],
      },
      palette: [
        '#f97316',
        '#ef4444',
        '#fb923c',
        '#dc2626',
        '#fbbf24',
        '#f59e0b',
        '#fcd34d',
        '#ea580c',
        '#b91c1c',
        '#991b1b',
      ],
    },
  }

  return schemes[scheme]
}