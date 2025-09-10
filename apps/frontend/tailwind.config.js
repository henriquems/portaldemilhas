/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../../packages/core/**/*.{ts,tsx}"
  ],
  safelist: [
    "bg-blue-700",
    "bg-red-700",
    "bg-orange-700",
    "bg-green-700",
    'bg-violet-700',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
