/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand palette
        brand: {
          DEFAULT: '#0B5D3B', // deep green
          50: '#E7F1EA',
          100: '#C9E1CF',
          200: '#94C39F',
          300: '#5FA06F',
          400: '#2D7E48',
          500: '#0B5D3B',
          600: '#094A30',
          700: '#073824',
          800: '#052819',
          900: '#03190F',
        },
        saffron: {
          DEFAULT: '#F4A300',
          50: '#FEF3DF',
          100: '#FDE6B8',
          200: '#FBCD6B',
          300: '#F9B832',
          400: '#F4A300',
          500: '#D88A00',
          600: '#A86A00',
        },
        neutraltint: {
          DEFAULT: '#EEF3EE',
          50: '#F7FAF7',
          100: '#EEF3EE',
          200: '#DCE7DD',
          300: '#C2D4C4',
        },
        ink: {
          DEFAULT: '#1F2A24',
          50: '#E8EAE8',
          100: '#C5CBC6',
          200: '#94A09A',
          300: '#637368',
          400: '#3D4B41',
          500: '#1F2A24',
          600: '#19211D',
        },
        terracotta: {
          DEFAULT: '#C8553D',
          50: '#FBEBE6',
          100: '#F5CFC2',
          200: '#EBA691',
          300: '#DD7B5E',
          400: '#C8553D',
          500: '#A8431F',
        },
      },
      fontFamily: {
        serif: ['"Cambria"', '"Georgia"', '"Times New Roman"', 'serif'],
        sans: ['"Inter"', '"Calibri"', 'system-ui', 'sans-serif'],
        kannada: ['"Noto Sans Kannada"', 'sans-serif'],
        telugu: ['"Noto Sans Telugu"', 'sans-serif'],
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(31,42,36,0.04), 0 8px 24px rgba(31,42,36,0.06)',
        soft: '0 2px 8px rgba(31,42,36,0.05)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'wave': {
          '0%, 100%': { transform: 'scaleY(0.4)' },
          '50%': { transform: 'scaleY(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out',
        'pop-in': 'pop-in 0.25s ease-out',
      },
    },
  },
  plugins: [],
};
