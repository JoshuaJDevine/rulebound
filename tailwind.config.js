/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Riftbound Dark Blue - Primary brand color
        primary: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#102a43',
        },
        // Riftbound Gold - Accent color
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Neutral grays
        neutral: {
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
        // Semantic colors
        success: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
        info: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
      fontFamily: {
        display: ['"Cinzel"', 'Georgia', '"Times New Roman"', 'serif'],
        body: ['"Crimson Pro"', 'Georgia', '"Times New Roman"', 'serif'],
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          '"SF Mono"',
          'Menlo',
          'Monaco',
          'Consolas',
          '"Liberation Mono"',
          '"Courier New"',
          'monospace',
        ],
      },
      fontSize: {
        // Captions and labels
        xs: ['0.75rem', { lineHeight: '1.5', fontWeight: '500' }],
        // Body and secondary text
        sm: ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        base: ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        lg: ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
        // Headings
        xl: ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        '2xl': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
        '3xl': ['1.875rem', { lineHeight: '1.25', fontWeight: '600' }],
        '4xl': ['2.25rem', { lineHeight: '1.2', fontWeight: '700' }],
        '5xl': ['3rem', { lineHeight: '1.1', fontWeight: '700' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
      borderRadius: {
        'none': '0',
        'sm': '4px',
        DEFAULT: '8px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        'full': '9999px',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgb(16 42 67 / 0.05)',
        DEFAULT: '0 4px 6px -1px rgb(16 42 67 / 0.08), 0 2px 4px -2px rgb(16 42 67 / 0.05)',
        md: '0 4px 6px -1px rgb(16 42 67 / 0.08), 0 2px 4px -2px rgb(16 42 67 / 0.05)',
        lg: '0 10px 15px -3px rgb(16 42 67 / 0.08), 0 4px 6px -4px rgb(16 42 67 / 0.05)',
        xl: '0 20px 25px -5px rgb(16 42 67 / 0.1), 0 8px 10px -6px rgb(16 42 67 / 0.05)',
        'glow-accent': '0 0 20px rgb(251 191 36 / 0.3)',
        // Dark mode shadows
        'dm-sm': '0 1px 2px 0 rgb(0 0 0 / 0.3)',
        'dm-md': '0 4px 6px -1px rgb(0 0 0 / 0.3)',
        'dm-lg': '0 10px 15px -3px rgb(0 0 0 / 0.3)',
      },
      ringWidth: {
        DEFAULT: '3px',
      },
      ringOffsetWidth: {
        DEFAULT: '2px',
      },
      transitionDuration: {
        fast: '150ms',
        normal: '200ms',
        slow: '300ms',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
