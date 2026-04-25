/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "/index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        'primary-green':'#006d4e'
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'serif'],
      },
    },
  },
  plugins: [],
}

