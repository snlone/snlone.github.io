/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        claude: {
          bg: '#F8F5F0',
          surface: '#FDFAF7',
          'surface-2': '#FFFFFF',
          border: '#E8DDD3',
          'border-light': '#EFE8DF',
          orange: '#D97757',
          'orange-hover': '#C96A45',
          'orange-light': '#FCF0E8',
          'orange-subtle': '#FAE8D8',
          text: '#1C1208',
          'text-secondary': '#5C4D40',
          'text-muted': '#9A8B7E',
          'text-faint': '#BFB4A8',
          'surface-hover': '#F3EDE5',
        },
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Noto Serif SC', 'Georgia', 'serif'],
        sans: ['Geist', 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei UI', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 4px 0 rgba(28,18,8,0.06), 0 0 0 1px rgba(28,18,8,0.04)',
        'card-hover': '0 4px 16px 0 rgba(28,18,8,0.08), 0 0 0 1px rgba(28,18,8,0.05)',
        'input': '0 1px 3px 0 rgba(28,18,8,0.05) inset',
        'modal': '0 24px 64px 0 rgba(28,18,8,0.18), 0 0 0 1px rgba(28,18,8,0.06)',
        'glow-orange': '0 0 0 3px rgba(217,119,87,0.18)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
    },
  },
  plugins: [],
}
