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
        canvas: {
          dark: '#0a0e27',
          light: '#ffffff',
        },
        accent: '#00d4ff',
        surface: {
          dark: '#1a1f3a',
          light: '#f5f5f5',
        },
        border: {
          dark: '#2a3050',
          light: '#e5e7eb',
        },
        text: {
          primary: {
            dark: '#e5e7eb',
            light: '#1f2937',
          },
          secondary: {
            dark: '#9ca3af',
            light: '#6b7280',
          },
        },
      },
      spacing: {
        'toolbar': '60px',
        'sidebar': '280px',
      },
    },
  },
  plugins: [],
}
