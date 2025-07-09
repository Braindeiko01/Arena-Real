/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        dark: '#1a1a1a',
        darker: '#121212',
        primary: '#facc15',
      },
    },
  },
  plugins: [],
};
