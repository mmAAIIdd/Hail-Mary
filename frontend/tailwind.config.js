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
          50: '#f5f6ef',
          100: '#e8edda',
          200: '#d4ddb9',
          300: '#b9c78e',
          400: '#8fa566',
          500: '#596b42',
          600: '#4b5b38',
          700: '#394a2d',
          800: '#2f3d27',
          900: '#273322',
          950: '#1e271b',
        },
        paper: '#f7f3ea',
        ink: '#1f2420',
        khaki: '#596b42',
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
