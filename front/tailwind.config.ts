import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        body: ['Inter', 'ui-sans-serif', 'system-ui'],
        headline: ['Poppins', 'ui-sans-serif', 'system-ui'],
        code: ['monospace'],
      },
      colors: {
        bg: 'var(--bg)',
        panel: 'var(--panel)',
        panel2: 'var(--panel-2)',
        gold: {
          DEFAULT: 'var(--gold)',
          strong: 'var(--gold-strong)',
        },
        text: {
          DEFAULT: 'var(--text)',
          primary: 'var(--text)',
          sec: 'var(--muted)',
        },
        muted: {
          DEFAULT: 'var(--panel-2)',
          foreground: 'var(--muted)',
        },
        stroke: 'var(--stroke)',
        success: 'var(--success)',
        error: 'var(--error)',
        background: 'var(--bg)',
        foreground: 'var(--text)',
        card: {
          DEFAULT: 'var(--panel)',
          foreground: 'var(--text)',
        },
        popover: {
          DEFAULT: 'var(--panel)',
          foreground: 'var(--text)',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          dark: 'hsl(var(--primary-dark))',
        },
        secondary: {
          DEFAULT: 'var(--panel)',
          foreground: 'var(--text)',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'var(--stroke)',
        input: 'var(--stroke)',
        ring: 'var(--gold)',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        '2xl': 'calc(var(--radius) + 4px)',
      },
      boxShadow: {
        soft: 'var(--shadow)',
        'cartoon': '0 4px 0 hsl(var(--primary-dark)), 0 6px 10px rgba(0,0,0,0.2)',
        'cartoon-sm': '0 2px 0 hsl(var(--primary-dark)), 0 3px 5px rgba(0,0,0,0.15)',
        'cartoon-active': '0 2px 0 hsl(var(--primary-dark)), 0 3px 5px rgba(0,0,0,0.2)',
        'card-medieval': '5px 5px 0px 0px hsl(var(--border))',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'subtle-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-3px)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'subtle-bounce': 'subtle-bounce 1.5s ease-in-out infinite',
        // speed up modal entrance to avoid perceived lag
        'fade-in-up': 'fade-in-up 0.2s ease-out forwards',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
