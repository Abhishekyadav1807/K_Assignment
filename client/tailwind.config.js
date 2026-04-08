/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#13232f",
        mist: "#f3efe7",
        accent: "#d8643c",
        pine: "#2e5f51",
        gold: "#c8a25c"
      },
      fontFamily: {
        sans: ["'Manrope'", "system-ui", "sans-serif"],
        display: ["'Sora'", "system-ui", "sans-serif"]
      },
      boxShadow: {
        card: "0 14px 40px rgba(19, 35, 47, 0.12)"
      }
    }
  },
  plugins: []
};
