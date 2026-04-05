/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        claude: {
          bg: '#FAF9F6',
          surface: '#FFFFFF',
          border: '#E5DDD5',
          'border-light': '#EDE8E1',
          orange: '#D97757',
          'orange-hover': '#C96A45',
          'orange-light': '#FDF0E8',
          'orange-subtle': '#FBE6D8',
          text: '#1A1107',
          'text-secondary': '#6B5B4E',
          'text-muted': '#9B8B7E',
          'surface-hover': '#F5F0EA',
        },
      },
    },
  },
  plugins: [],
}

