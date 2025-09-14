import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // CSS Custom Property based colors for theme switching
        background: {
          DEFAULT: 'hsl(var(--background))',
          secondary: 'hsl(var(--background-secondary))',
          tertiary: 'hsl(var(--background-tertiary))'
        },
        foreground: {
          DEFAULT: 'hsl(var(--foreground))',
          secondary: 'hsl(var(--foreground-secondary))',
          tertiary: 'hsl(var(--foreground-tertiary))'
        },
        border: {
          DEFAULT: 'hsl(var(--border))',
          hover: 'hsl(var(--border-hover))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          hover: 'hsl(var(--card-hover))'
        },
        muted: 'hsl(var(--muted))',
        accent: 'hsl(var(--accent))',
        
        // Monochrome color palette - black & white only
        primary: {
          50: '#f9f9f9',   // Very light gray
          100: '#f5f5f5',  // Light gray
          200: '#eeeeee',  // Light gray
          300: '#cccccc',  // Medium light gray (dark mode secondary)
          400: '#999999',  // Medium gray (dark mode muted)
          500: '#666666',  // Medium dark gray (light mode muted)
          600: '#333333',  // Dark gray (light mode secondary)
          700: '#222222',  // Very dark gray (dark mode hover bg)
          800: '#111111',  // Almost black
          900: '#000000',  // Pure black
        },
        cyber: {
          50: '#f9f9f9',   // Map to grayscale
          100: '#f5f5f5',
          200: '#eeeeee',
          300: '#cccccc',
          400: '#999999',
          500: '#666666',
          600: '#333333',
          700: '#222222',
          800: '#111111',
          900: '#000000',
        },
        purple: {
          50: '#f9f9f9',   // Map to grayscale
          100: '#f5f5f5',
          200: '#eeeeee',
          300: '#cccccc',
          400: '#999999',
          500: '#666666',
          600: '#333333',
          700: '#222222',
          800: '#111111',
          900: '#000000',
        },

        // Semantic monochrome colors
        mono: {
          white: '#ffffff',
          'gray-50': '#f9f9f9',
          'gray-100': '#f5f5f5',
          'gray-200': '#eeeeee',
          'gray-300': '#cccccc',
          'gray-400': '#999999',
          'gray-500': '#666666',
          'gray-600': '#333333',
          'gray-700': '#222222',
          'gray-800': '#111111',
          black: '#000000',
        },

        // Selective accent colors (sparingly used)
        accent: {
          blue: {
            DEFAULT: '#2563EB', // Soft blue for CTAs and highlights
            light: '#3B82F6',
            dark: '#1D4ED8',
          },
          green: {
            DEFAULT: '#10B981', // Green for success states and availability
            light: '#34D399',
            dark: '#059669',
          },
          warning: {
            DEFAULT: '#F59E0B', // Orange/yellow for caution states
            light: '#FBBF24',
            dark: '#D97706',
          }
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'mono-grid': 'linear-gradient(rgba(102, 102, 102, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(102, 102, 102, 0.1) 1px, transparent 1px)',
      },
      animation: {
        'pulse-glow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
} satisfies Config;