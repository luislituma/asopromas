/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        chocolate: {
          50: '#f9f6f3',
          100: '#f0e9e1',
          200: '#e1d2c2',
          300: '#cdb29a',
          400: '#b89073',
          500: '#a67554',
          600: '#9b6246',
          700: '#814f3b',
          800: '#694132',
          900: '#55362a',
          950: '#2d1b14'
        },
        'cacao-green': {
          50: '#f2f7f4',
          100: '#e1efe6',
          200: '#c5e0d0',
          300: '#9bc8af',
          400: '#6ba986',
          500: '#478c66',
          600: '#346f4f',
          700: '#2a5940',
          800: '#244735',
          900: '#1e3b2d',
          950: '#0f2018'
        }
      }
    },
  },
  plugins: [],
}
