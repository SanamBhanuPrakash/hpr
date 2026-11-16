/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#2196F3',
        'brand-green': '#8BC34A',
        'light-green': '#C8E6C9',
      }
    },
  },
  plugins: [],
}