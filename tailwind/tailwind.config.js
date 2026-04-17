/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}", "./index.html"],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['Inter', 'sans-serif'],
      },
      colors: {
        'warm': '#F5E6D3',
        'accent': '#C9A87C',
        'dark': '#1A1A1A',
      }
    },
  },
  plugins: [],
}
