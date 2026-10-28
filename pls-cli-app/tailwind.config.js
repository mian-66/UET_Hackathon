/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#0B0F19',
          elevated: '#0F172A',
          surface: '#182234',
          subtle: '#1E293B',
          border: '#1E293B',
          borderHover: '#334155',
        },
        lime: {
          accent: '#A3E635', // Electric lime
          dark: '#84CC16',
          glow: 'rgba(163, 230, 53, 0.25)'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      },
      boxShadow: {
        'lime-glow': '0 0 20px -3px rgba(163, 230, 53, 0.25)',
        'lime-subtle': '0 0 12px 0 rgba(163, 230, 53, 0.15)',
        'card-elevated': '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.4)'
      }
    },
  },
  plugins: [],
};
