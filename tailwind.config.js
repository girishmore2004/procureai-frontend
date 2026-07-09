/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Deep navy-indigo — replaces the generic default blue everywhere
        // brand-*/text-brand-*/border-brand-* classes are already used, so
        // this alone re-skins every page without touching page logic.
        brand: {
          50: '#EFF3FA',
          100: '#DEE6F4',
          200: '#B9C9E6',
          300: '#8CA6D0',
          400: '#5D7BAE',
          500: '#3E5885',
          600: '#233252',
          700: '#1B2740',
          800: '#141D30',
          900: '#0E1524',
        },
        // Warm brass/gold accent for highlights, key actions, "approved" states
        accent: {
          50: '#FCF6E9',
          100: '#F8EACB',
          300: '#EDCB86',
          400: '#E4B25C',
          500: '#CE9942',
          600: '#B4863A',
        },
        ink: '#101826',
        surface: '#F6F7FA',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,38,0.04), 0 1px 1px rgba(16,24,38,0.03)',
        'card-hover': '0 8px 24px -8px rgba(16,24,38,0.16)',
        popover: '0 16px 40px -12px rgba(16,24,38,0.28)',
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
      },
    },
  },
  plugins: [],
};
