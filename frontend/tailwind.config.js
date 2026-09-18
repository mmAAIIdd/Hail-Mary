/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fbebe5',
          100: '#f7d6ca',
          200: '#efb29f',
          300: '#e58b71',
          400: '#dc6846',
          500: '#d6552e',
          600: '#bd4728',
          700: '#a93e25',
          800: '#87331f',
          900: '#6d2b1c',
          950: '#4a2118',
        },
        paper: '#f7f3ea',
        ink: '#1f2420',
        terracotta: '#d6552e',
      },
      fontFamily: {
        sans: ['Liter', 'Arial', 'sans-serif'],
        serif: ['Liter', 'Arial', 'sans-serif'],
        brand: ['Liter', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
