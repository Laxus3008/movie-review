/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        admin: {
          50: '#f8fafc',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          900: '#312e81',
        },
        danger: {
          500: '#ef4444',
          600: '#dc2626',
        }
      }
    },
  },
  plugins: [],
}
