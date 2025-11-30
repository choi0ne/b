/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#DC2626',
        'brand-secondary': '#B91C1C',
        'brand-accent': '#FFC107',
        'brand-light': '#F0F7F7',
        'brand-dark': '#1A202C',
        'brand-google-blue': '#4285F4',
      },
      animation: {
        'spin': 'spin 1s linear infinite',
      },
    },
  },
  plugins: [],
}
