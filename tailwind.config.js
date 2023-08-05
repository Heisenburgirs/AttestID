/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./src/**/*.tsx', './src/**/*.ts'], // Add paths to your TypeScript files here
  darkMode: false, // or 'media' or 'class'
  theme: {
    borderRadius: {
      "sm": "5px"
    },
    fontSize: {
      "sm": "12px",
      "sm2": "14px",
      "base": "16px",
      "xl": "22px",
      "2xl": "24px",
      "3xl": "48px",
      "4xl": "64px"
    },
    screens: {
      "sm": "250px",
      "base": "420px",
      "md": "768px",
      "lg": "1100px",
      "xl": "1400px"
    },
    extend: {
      colors: {
        "world": "#191c20",
        "background-color": "#121317",
        "background-color-2": "#121417",
        "background-color-lighter": "#1B1C1E",
        "grey-border-color": "#35383D",
        "font-grey-opacity": "rgba(255, 255, 255, 0.65)",
        "divider": "rgba(94, 160, 197, 1)",
        "blue-accent": "#429DFA",
        "lighter-blue-accent": "#2C3D47",
        "red-accent": "#9F113A",
        "secondary-red": "#A11136",
        "font-brightest": "#E1E2E2",
        "white": "#FFFFFF",
        "font-mid": "#C6C6C7",
        "font-low": "#B6B6B7",
        "primary-blue": "#5EA0C5",
        "primary-grey": "#B5B5B5",
        "primary-green": "#5FBF3D",
        "primary-red": "#C73131",
        "primary-grey": "#8F8F8F",
        "modal-background-opacity": "rgba(0,0,0,0.8)",
        "check-border": "#5EA0C540",
        "selected-trait": "#474A4F",
        "usd-price": "#ACADAE",
        "cart-hover": "#242629"
      },
      gridTemplateColumns: {
        "zk-auto": "repeat(auto-fill, minmax(220px, 1fr))",
        "zk-auto-launch": "repeat(auto-fill, minmax(300px, 1fr))"
      },
      gridTemplateRows: {
        "zk-auto-launch": "repeat(auto-fill, minmax(150px, 1fr))"
      }
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
    require("prettier-plugin-tailwindcss")],
}
