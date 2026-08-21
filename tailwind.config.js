/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        hand: ['"Comic Sans MS"', '"Comic Sans"', 'cursive', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
