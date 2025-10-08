/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores modernos para casa de apuestas
        primary: {
          50: '#E6F0FF',
          100: '#CCE0FF',
          200: '#99C2FF',
          300: '#66A3FF',
          400: '#3385FF',
          500: '#0066FF',
          600: '#0052CC',
          700: '#003D99',
          800: '#002966',
          900: '#001433',
          950: '#000A1A',
        },
        secondary: {
          50: '#FFF4E6',
          100: '#FFE9CC',
          200: '#FFD299',
          300: '#FFBC66',
          400: '#FFA533',
          500: '#FF8F00',
          600: '#CC7200',
          700: '#995600',
          800: '#663900',
          900: '#331D00',
        },
        dark: {
          50: '#F5F7FA',
          100: '#E4E9F0',
          200: '#C9D3E0',
          300: '#A8B8CC',
          400: '#7A8FA3',
          500: '#5A6C7D',
          600: '#455362',
          700: '#343D47',
          800: '#1F252B',
          900: '#0F1419',
          950: '#080B0E',
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #0066FF 0%, #003D99 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #FF8F00 0%, #CC7200 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0F1419 0%, #1F252B 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      }
    },
  },
  plugins: [],
}
