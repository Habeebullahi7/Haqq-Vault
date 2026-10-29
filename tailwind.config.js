module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: { navy: { DEFAULT: '#0A1931', light: '#122A5A' }, gold: '#D4AF37', lightgray: '#F5F7FB' },
      fontFamily: { sans: ['Inter','sans-serif'] }
    }
  },
  plugins: [],
}
