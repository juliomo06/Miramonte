/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
  ],
  darkMode: ['class'],
  theme: {
    extend: {
      fontFamily:{
        'f1':['f1', 'OpenSans'],
        'f2':['f2', 'LinBiolinum_R'],
        'f3':['f3', 'Century Regular'],
      },
      screens: {
        'phone': '450px',
        'tablet': '744px',
        'res1': '840px',
        'laptop': '1024px',
        'desktop': '1280px',
      },
    },
  },

  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: ["light","dark", "cupcake"], 
    darkTheme: "light", 
    base: true, 
    styled: true, 
    utils: true, 
    prefix: "", 
    logs: true, 
    themeRoot: ":root", 
  },
}