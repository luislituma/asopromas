/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        shine: {
          '0%':      { transform: 'translateX(-100%) skewX(-15deg)' },
          '60%, 100%': { transform: 'translateX(250%) skewX(-15deg)' },
        },
      },
      animation: {
        shine: 'shine 2.8s ease-in-out infinite',
      },
      colors: {
        // ── Tokens de marca BRAND.md ──
        'asop-dark':  '#3C1E00',
        'asop-mid':   '#694B1E',
        'asop-text':  '#1A1A1A',
        'asop-green': '#2B4D3F',
        'asop-deep':  '#1A3028',
        'asop-cert':  '#7A9E3B',
        'asop-cream': '#F2EAD8',
        'asop-cta':   '#C45A28',
        'kuj-orange': '#D8683C',
        'kuj-green':  '#385034',
        'kuj-brown':  '#402818',
        'kuj-cream':  '#FDF6EE',
        'kuj-dark':   '#1E2A1A',
        'brand-divider': '#E0D5C8',
        // ── Escala legacy (ERP interno) ──
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
        'cacao-gold': {
          300: '#F2C55C',
          400: '#E8A830',
          500: '#C8850A',
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
