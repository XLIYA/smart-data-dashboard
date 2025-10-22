// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Vite می‌فهمد '/src' یعنی پوشه src در ریشه پروژه
    alias: { '@': '/src' },
  },
  server: { port: 5173, open: false },
  preview: { port: 5173 },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'chart-vendor': ['echarts'],
          'ui-vendor': ['lucide-react', '@radix-ui/react-select'],
        },
      },
    },
  },
})
