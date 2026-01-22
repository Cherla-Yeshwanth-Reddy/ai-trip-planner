/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",   // blue
        secondary: "#22c55e" // green
      }
    },
  },
  plugins: [],
}
