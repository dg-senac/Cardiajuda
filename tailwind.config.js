/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cor-primaria': '#8B008B',
        'cor-primaria-hover': '#6E006E',
        'cor-primaria-escura': '#4B0049',
        'cor-fundo-rosa': '#FFE4F3',
        'cor-fundo-rosa-2': '#F8D0EA',
        'cor-fundo': '#FFFFFF',
        'cor-borda-input': '#8B008B',
        'cor-texto': '#1A1A1A',
        'cor-texto-claro': '#FFFFFF',
        'cor-placeholder': '#9A7A95',
        'cor-link': '#8B008B',
        'status-normal': '#2E9E4F',
        'status-atencao': '#F2A900',
        'status-alerta': '#D62839',
      },
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
