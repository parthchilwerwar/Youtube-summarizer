const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Orange Theme
        orange: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#FF6B00', // Primary vibrant orange
          600: '#E55A00', // Darker orange
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
        },
        // GitHub Dark Theme
        github: {
          50: '#F6F8FA',
          100: '#EAEEF2',
          200: '#D0D7DE',
          300: '#AFB8C1',
          400: '#8B949E',
          500: '#6E7681',
          600: '#57606A',
          700: '#424A53',
          800: '#32383F',
          900: '#24292F',
          950: '#0D1117', // Primary GitHub dark black
        },
        // Custom theme colors
        primary: {
          DEFAULT: '#FF6B00',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#0D1117',
          foreground: '#F0F6FC',
        },
        background: {
          DEFAULT: '#0D1117',
          secondary: '#161B22',
        },
        foreground: {
          DEFAULT: '#F0F6FC',
          secondary: '#8B949E',
        },
        border: {
          DEFAULT: '#21262D',
          hover: '#FF6B00',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'JetBrains Mono', 'Consolas', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-in': 'slideIn 0.5s ease-out',
        'pulse-orange': 'pulseOrange 2s infinite',
        'bounce-subtle': 'bounceSubtle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseOrange: {
          '0%, 100%': { 
            backgroundColor: '#FF6B00',
            opacity: '1' 
          },
          '50%': { 
            backgroundColor: '#FF8533',
            opacity: '0.7' 
          },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      boxShadow: {
        'orange': '0 4px 14px 0 rgba(255, 107, 0, 0.2)',
        'orange-lg': '0 10px 25px -3px rgba(255, 107, 0, 0.3)',
        'orange-xl': '0 20px 40px -4px rgba(255, 107, 0, 0.4)',
        'glow': '0 0 20px rgba(255, 107, 0, 0.5)',
        'glow-lg': '0 0 40px rgba(255, 107, 0, 0.6)',
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'gradient-orange': 'linear-gradient(135deg, #FF6B00 0%, #FF8533 100%)',
        'gradient-orange-reverse': 'linear-gradient(135deg, #FF8533 0%, #FF6B00 100%)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        dark: {
          colors: {
            primary: {
              DEFAULT: '#FF6B00',
              foreground: '#FFFFFF',
            },
            secondary: {
              DEFAULT: '#0D1117',
              foreground: '#F0F6FC',
            },
            background: {
              DEFAULT: '#0D1117',
            },
            foreground: {
              DEFAULT: '#F0F6FC',
            },
            content1: '#161B22',
            content2: '#21262D',
            content3: '#32383F',
            content4: '#424A53',
          },
        },
      },
    }),
  ],
};