/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Violeta eléctrico: acciones principales
        primary: {
          50: '#F0EEFF',
          100: '#E1DCFF',
          200: '#C3B9FF',
          300: '#A596FF',
          400: '#8670FF',
          500: '#6C4DFF',
          600: '#5636E6',
          700: '#4326B8',
          800: '#2F1A82',
          900: '#1D1054',
          950: '#0F082E',
        },
        // Rosa/naranja: urgencia, en vivo, destacados
        secondary: {
          50: '#FFF1F4',
          100: '#FFE0E8',
          200: '#FFC2D2',
          300: '#FF94B0',
          400: '#FF5F8D',
          500: '#FF2E6E',
          600: '#E01457',
          700: '#B00C44',
          800: '#7E0A32',
          900: '#4D0620',
        },
        // Verde neón (reemplaza al antiguo dorado en toda la app)
        yellow: {
          50: '#E8FFF4',
          100: '#C4FFE3',
          200: '#8CFFC9',
          300: '#4DFFAE',
          400: '#1AF59A',
          500: '#00E58A',
          600: '#00C474',
          700: '#00985A',
          800: '#006B40',
          900: '#003D25',
          950: '#002013',
        },
        neon: {
          DEFAULT: '#00E58A',
          cyan: '#22D3EE',
          violet: '#8670FF',
          pink: '#FF2E6E',
        },
        // Azul medianoche: fondos y superficies
        dark: {
          50: '#F4F6FB',
          100: '#E3E8F4',
          200: '#C6CFE6',
          300: '#9AA7C7',
          400: '#7584A8',
          500: '#566587',
          600: '#3A4764',
          700: '#262F47',
          800: '#151B2E',
          900: '#0B0F1E',
          950: '#060913',
        }
      },
      boxShadow: {
        'neon': '0 0 24px rgba(0, 229, 138, 0.35)',
        'violet': '0 0 28px rgba(108, 77, 255, 0.45)',
        'card': '0 10px 40px -12px rgba(0, 0, 0, 0.6)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6C4DFF 0%, #4326B8 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #FF2E6E 0%, #FF8A3D 100%)',
        'gradient-neon': 'linear-gradient(135deg, #00E58A 0%, #22D3EE 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0B0F1E 0%, #151B2E 100%)',
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
