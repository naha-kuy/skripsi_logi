/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
    "!./node_modules/**"
  ],
  theme: {
    extend: {
      colors: {
        feather: { DEFAULT: '#58cc02', dark: '#46a302', light: '#89e219' },
        macaw: { DEFAULT: '#1cb0f6', dark: '#1899d6', light: '#5ce5ff' },
        cardinal: { DEFAULT: '#ff4b4b', dark: '#ea2b2b', light: '#ff8686' },
        bee: { DEFAULT: '#ffc800', dark: '#e5a500', light: '#ffdf4d' },
        fox: { DEFAULT: '#ff9600', dark: '#e58700' },
        hare: { DEFAULT: '#ce82ff', dark: '#a568cc' },
        wolf: { DEFAULT: '#7797b2', dark: '#5b788e' },
        swan: { DEFAULT: '#e5e5e5', dark: '#afafaf' }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif']
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem'
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' }
        }
      }
    }
  },
  plugins: [],
}