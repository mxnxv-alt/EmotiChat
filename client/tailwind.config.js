/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#33006F'
        },
        secondary: {
          DEFAULT: '#800080'
        },
      },
    },
  },
  plugins: [],
}
