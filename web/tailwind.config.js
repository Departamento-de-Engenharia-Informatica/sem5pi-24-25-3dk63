/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        text: "var(--text)",
        background: "var(--background)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
        "primary-500": "var(--primary-500)",
        "primary-700": "var(--primary-700)",
      },
      fontFamily: {
        sans: ["Roboto", "Arial", "sans-serif"],
        poppins: ["Poppins", "Arial", "sans-serif"],
        archivo: ["Archivo", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
