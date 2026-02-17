/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./core/**/*.{js,ts,jsx,tsx}",
    "./routes/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: "#0b172a",
        mist: "#e9eef7",
        accent: "#6b9bff",
        sage: "#d9e8e1",
      },
      boxShadow: {
        subtle: "0 10px 40px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
};
