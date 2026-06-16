import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-ibm-plex)', 'system-ui', 'sans-serif'],
      },
      colors: {
        foreground: 'var(--text-primary)',
        background: 'var(--bg-primary)',
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        border: 'var(--border)',
        'border-subtle': 'var(--border-subtle)',
        accent: 'var(--accent)',
        'card-bg': 'var(--card-bg)',
        'card-border': 'var(--card-border)',
        separator: 'var(--separator)',
        'stat-separator': 'var(--stat-separator)',
      },
      animation: {
        'spin-slow': 'spin-slow 1.5s linear infinite',
        'delete-confirm': 'delete-confirm-appear 150ms ease-out',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        'spin-slow': {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        },
        'delete-confirm-appear': {
          'from': { opacity: '0', transform: 'scale(0.95)' },
          'to': { opacity: '1', transform: 'scale(1)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
