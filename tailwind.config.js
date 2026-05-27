/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: '#FDF8F2',
        card: '#FEFCF8',
        gold: {
          DEFAULT: '#C8963C',
          light: '#E8C97A',
          dark: '#9E6F25',
        },
        rose: {
          DEFAULT: '#D4A5A5',
          light: '#E8B4B8',
        },
        ink: '#2C2C2C',
        umber: '#6B5B4E',
        event: '#FFF9F0',
      },
      fontFamily: {
        amiri: ['Amiri', 'serif'],
        lato: ['Lato', 'sans-serif'],
        playfair: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}
