/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        Inter: `"Inter", serif`,
        Grotesk: `"Space Grotesk", serif`,
        Roboto: `"Roboto", serif`,
        DM: `"DM Sans", serif`,
        Inria: `"Inria Sans", sans-serif`
      }
    },
  },
  plugins: [],
}

