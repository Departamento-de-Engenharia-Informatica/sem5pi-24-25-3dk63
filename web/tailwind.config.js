/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    // Aqui você pode adicionar as classes que o Tailwind deve "ignorar" ou que você quer garantir que ele aceite
    "page:computeTangents",
    "page:fromGeometry",
    "page:getAttribute",
    "page:intersectObject",
    "page:light",
    "page:Raycaster.intersectObject",
  ],
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
