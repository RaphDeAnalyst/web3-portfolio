import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    screens: {
      'xs': '360px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
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

        // Storj.io color system
        storj: {
          navy: 'hsl(220, 54%, 23%)', // Primary Navy for backgrounds and headers
          blue: 'hsl(214, 84%, 56%)', // Secondary Blue for CTAs and accents
          muted: 'hsl(220, 9%, 46%)', // Muted text color
          background: 'hsl(210, 17%, 96%)', // Light gray background
          white: '#ffffff',
        },

        // Primary colors using Storj navy and blue
        primary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: 'hsl(214, 84%, 56%)', // Storj blue
          600: 'hsl(220, 54%, 23%)', // Storj navy
          700: 'hsl(220, 54%, 18%)',
          800: 'hsl(220, 54%, 13%)',
          900: 'hsl(220, 54%, 8%)',
        },

        // Update cyber colors to use Storj blue
        cyber: {
          50: '#f0f7ff',
          100: '#e0efff',
          200: '#b8e0ff',
          300: '#78c7ff',
          400: '#2fa7ff',
          500: 'hsl(214, 84%, 56%)', // Storj blue
          600: 'hsl(220, 54%, 23%)', // Storj navy
          700: 'hsl(220, 54%, 18%)',
          800: 'hsl(220, 54%, 13%)',
          900: 'hsl(220, 54%, 8%)',
        },

        // Update purple to use gray scale
        purple: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },

        // Accent colors using Storj palette
        accent: {
          blue: {
            DEFAULT: 'hsl(214, 84%, 56%)', // Storj blue
            light: 'hsl(214, 84%, 66%)',
            dark: 'hsl(220, 54%, 23%)', // Storj navy
          },
          green: {
            DEFAULT: '#10B981',
            light: '#34D399',
            dark: '#059669',
          },
          warning: {
            DEFAULT: '#F59E0B',
            light: '#FBBF24',
            dark: '#D97706',
          }
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'storj-gradient': 'linear-gradient(135deg, hsl(214, 84%, 56%) 0%, hsl(220, 54%, 23%) 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero': ['72px', { lineHeight: '1.1', fontWeight: '700' }],
        'subheading': ['20px', { lineHeight: '1.5', fontWeight: '400' }],
        'nav': ['16px', { lineHeight: '1.5', fontWeight: '500' }],
      },
      spacing: {
        '18': '4.5rem',
        '20': '5rem',
        '80': '20rem',
        '120': '30rem',
      },
      boxShadow: {
        'storj': '0 4px 20px rgba(0, 0, 0, 0.1)',
        'storj-hover': '0 8px 30px rgba(0, 0, 0, 0.15)',
        'storj-sm': '0 2px 10px rgba(0, 0, 0, 0.08)',
        'storj-lg': '0 10px 40px rgba(0, 0, 0, 0.12)',
        'header': '0 1px 3px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'storj': '8px',
        'storj-lg': '12px',
      },
      maxWidth: {
        'storj': '1200px',
      },
      animation: {
        'pulse-glow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'scale-hover': 'scaleHover 200ms ease',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleHover: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.05)' },
        }
      }
    },
  },
  plugins: [],
} satisfies Config;