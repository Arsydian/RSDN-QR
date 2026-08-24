/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ars: {
          red: {
            DEFAULT: '#D82125',
            50: '#FDECEC',
            100: '#F9D3D4',
            600: '#B81A1F',
            700: '#8F1317',
          },
          black: '#0C0A0B',
          ink: '#18171A',
          graphite: '#2A2A2E',
          paper: '#FAFAFB',
          white: '#FFFFFF',
          grey: {
            DEFAULT: '#807F84',
            50: '#F6F5F7',
            100: '#EDECEE',
            200: '#DEDDE0',
            300: '#C3C2C7',
            400: '#9E9DA2',
            600: '#5F5E63',
          },
          success: '#1F8A4C',
          warning: '#C98A12',
          info: '#2563A8',
        }
      },
      fontFamily: {
        display: ['Montserrat', 'Helvetica Neue', 'Arial', 'sans-serif'],
        sans: ['Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'ars-xs': '0 1px 2px rgba(12, 10, 11, 0.05)',
        'ars-sm': '0 2px 6px rgba(12, 10, 11, 0.06), 0 1px 2px rgba(12, 10, 11, 0.04)',
        'ars-md': '0 8px 20px rgba(12, 10, 11, 0.08), 0 2px 6px rgba(12, 10, 11, 0.05)',
        'ars-lg': '0 20px 40px rgba(12, 10, 11, 0.1), 0 4px 10px rgba(12, 10, 11, 0.05)',
        'ars-accent': '0 10px 24px rgba(216, 33, 37, 0.25)',
      }
    },
  },
  plugins: [],
}
