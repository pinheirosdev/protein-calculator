/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'preto': {
          1: '#0A0A0A',
          2: '#1a1a1a',
        },
        'cinza': {
          1: '#aaaaaa',
        },
        'branco': {
          1: '#F7FAFC',
        }
      }
    },
  },
  plugins: [],
}