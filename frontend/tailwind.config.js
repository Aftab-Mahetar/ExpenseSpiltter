/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#f0f4ff',
          100: '#e0e9ff',
          200: '#c2d3ff',
          300: '#93aeff',
          400: '#6385ff',
          500: '#4361ee',
          600: '#3142d4',
          700: '#2833ab',
          800: '#262d84',
          900: '#232968',
        },
        accent: {
          400: '#f97316',
          500: '#ea580c',
        }
      },
    },
  },
  plugins: [],
}
