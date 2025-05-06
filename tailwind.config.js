/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', 'sans-serif'],
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
      },
      colors: {
        // Light mode colors
        light: {
          background: '#ffffff',
          text: '#1a1a1a',
          primary: '#6366f1',
          secondary: '#4f46e5',
        },
        // Dark mode colors
        dark: {
          background: '#1a1a1a',
          text: '#ffffff',
          primary: '#818cf8',
          secondary: '#6366f1',
        },
      },
    },
  },
  plugins: [],
};