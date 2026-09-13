import tailwindAnimate from 'tailwindcss-animate';

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
        google: {
          blue: {
            DEFAULT: '#1a73e8',
            hover: '#1557b0',
            light: '#e8f0fe',
            dark: '#8ab4f8',
            container: '#d2e3fc',
          },
          red: {
            DEFAULT: '#ea4335',
            hover: '#d93025',
            light: '#fce8e6',
            dark: '#f28b82',
          },
          yellow: {
            DEFAULT: '#fbbc04',
            hover: '#f29900',
            light: '#fef7e0',
            dark: '#fdd663',
          },
          green: {
            DEFAULT: '#34a853',
            hover: '#1e8e3e',
            light: '#e6f4ea',
            dark: '#81c995',
          },
          surface: {
            light: '#f8fafd',
            variant: '#f1f3f4',
            border: '#dadce0',
            text: '#202124',
            subtext: '#5f6368',
            dark: '#131314',
            'dark-card': '#1e1f20',
            'dark-elevated': '#28292a',
            'dark-border': '#3c4043',
            'dark-text': '#e3e3e3',
            'dark-subtext': '#9aa0a6',
          }
        }
      },
      fontFamily: {
        google: ['"Google Sans"', 'Roboto', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        'google-sm': '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
        'google-md': '0 1px 3px 0 rgba(60,64,67,0.3), 0 4px 8px 3px rgba(60,64,67,0.15)',
        'google-lg': '0 2px 6px 2px rgba(60,64,67,0.15), 0 8px 24px 4px rgba(60,64,67,0.2)',
        'google-fab': '0 1px 3px 0 rgba(60,64,67,0.3), 0 4px 8px 3px rgba(60,64,67,0.15)',
      },
      borderRadius: {
        '3xl': '1.75rem',
        'pill': '9999px',
      }
    },
  },
  plugins: [tailwindAnimate],
}
