import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: ['src/**/*.{ts,tsx,js,jsx,html}'],
  theme: {
    extend: {
      colors: {
        background: '#0B0F14',
        'background-end': '#111418',
        card: '#111418',
        'card-foreground': '#EDEDED',
        primary: '#D4AF37',
        'primary-light': '#FFD369',
        'primary-dark': '#B98C2A',
        accent: '#FFD369',
        text: {
          primary: '#EDEDED',
          secondary: '#A9AFB6',
        },
        stroke: 'rgba(255,255,255,0.1)',
        success: '#7ED57A',
        error: '#F16A6A',
      },
      borderRadius: {
        '2xl': '1.25rem',
      },
      boxShadow: {
        soft: '0 8px 24px rgba(0,0,0,0.25)',
        gold: '0 0 12px rgba(212,175,55,0.3)',
      },
      fontFamily: {
        headline: ['Cinzel', 'serif'],
        ui: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
