/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bhumisetu: {
          navy: {
            DEFAULT: '#0B2545',
            50: '#F0F4F8',
            100: '#D9E2EC',
            200: '#BCCCDC',
            300: '#9FB3C8',
            400: '#829AB1',
            500: '#627D98',
            600: '#486581',
            700: '#334E68',
            800: '#102A43',
            900: '#0B2545',
          },
          saffron: {
            DEFAULT: '#F59E0B',
            50: '#FFFBEB',
            100: '#FEF3C7',
            500: '#F59E0B',
            600: '#D97706',
          },
          green: {
            DEFAULT: '#138808',
            50: '#F0FDF4',
            100: '#DCFCE7',
            500: '#138808',
            600: '#0E6B06',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
