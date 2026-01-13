import { defineConfig } from '@tailwindcss/vite'

export default defineConfig({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand Colors
        'brand-pink': '#f800f7',
        'brand-purple': '#961998',
        'accent-pink': '#ec4899',
        'accent-magenta': '#d946ef',
        'accent-purple': '#8a2be2',
        'accent-light-purple': '#b05cff',
        
        // UI Colors
        'card-bg': '#0f1116',
        'card-bg-alt': '#0b0c10',
        'text-primary': 'rgba(255,255,255,.92)',
        'text-muted': 'rgba(255,255,255,.62)',
        'border-line': 'rgba(255,255,255,.08)',
        
        // MVP Blocks compatibility
        'foreground': 'rgba(255,255,255,.92)',
        'muted-foreground': 'rgba(255,255,255,.62)',
        'border': 'rgba(255,255,255,.08)',
        'card': '#0f1116',
        'background': '#000000',
      },
      fontFamily: {
        'azonix': ['Azonix', 'sans-serif'],
      },
      animation: {
        'twinkle-slow': 'twinkle 14s ease-in-out infinite',
        'twinkle-medium': 'twinkle 9s ease-in-out infinite',
        'twinkle-fast': 'twinkle 6s ease-in-out infinite',
        'pulse-nebula': 'pulse-nebula 15s ease-in-out infinite',
        'marquee': 'marquee var(--duration) linear infinite',
        'marquee-vertical': 'marquee-vertical var(--duration) linear infinite',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: '0.2' },
          '50%': { opacity: '1' },
        },
        'pulse-nebula': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '0.8' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% - var(--gap)))' },
        },
        'marquee-vertical': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(calc(-100% - var(--gap)))' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
})