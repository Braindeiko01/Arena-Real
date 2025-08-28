import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: ['src/**/*.{ts,tsx,js,jsx,html}'],
  theme: {
    extend: {
      colors: {
        bg: '#0B0D0E',
        panel: '#111315',
        panel2: '#0E1113',
        gold: {
          DEFAULT: '#E8C26E',
          strong: '#F2D27F',
        },
        text: {
          primary: '#EDEDED',
          secondary: '#A9AFB6',
        },
        stroke: '#2A2F33',
        success: '#7ED57A',
        error: '#F16A6A',
      },
      borderRadius: {
        '2xl': '1.25rem',
      },
      boxShadow: {
        soft: '0 8px 24px rgba(0,0,0,0.25)',
      },
      fontFamily: {
        display: ['Poppins', 'ui-sans-serif', 'system-ui'],
        ui: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
