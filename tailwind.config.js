/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx}',
    './src/app/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc7fb',
          400: '#38a8f7',
          500: '#0e8ce9',
          600: '#026fc7',
          700: '#0358a1',
          800: '#074b85',
          900: '#0c3f6e',
          950: '#082849',
        },
        navy: {
          700: '#1e2f52',
          800: '#15213b',
          850: '#101a2e',
          900: '#0c1322',
          950: '#070b14',
          975: '#04070d',
        },
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          800: '#1e293b',
          850: '#162033',
          900: '#0f172a',
          950: '#090e1a',
        },
      },
    },
  },
  plugins: [],
};
