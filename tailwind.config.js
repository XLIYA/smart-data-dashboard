/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: '#F6F8FB', dark: '#0E131A' },
        card: { light: 'rgba(255,255,255,0.7)', dark: 'rgba(20,24,31,0.6)' },
        borderSoft: { light: 'rgba(0,0,0,0.06)', dark: 'rgba(255,255,255,0.08)' },
        accent: {
          50:'#E6FFFB',100:'#C6FFF6',200:'#92F7EC',300:'#5FEAE1',
          400:'#2FD7D3',500:'#14C3C3',600:'#0FB0B3',700:'#0C8B92',800:'#0A6A72',900:'#084F56'
        },
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(16,24,40,0.12)',
      },
      borderRadius: {
        xl2: '1.2rem',
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
}
