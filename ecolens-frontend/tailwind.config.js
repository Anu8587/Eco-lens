/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'olive-green-base': '#3b5f3b',
        'olive-mist': '#f3f6f3',
        'soft-sage': '#6e8f6e',
        'forest-olive': '#2e472e',
        'earth-brown-olive': '#b2a88f',
        'herbal-glow': '#88a978',
        'deep-olive-text': '#2f3b2f',
        'light-olive-tint': '#f0f5f0',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};