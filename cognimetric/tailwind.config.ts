import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f2f5ff",
          100: "#e6ecff",
          200: "#c3d0ff",
          300: "#9fb3ff",
          400: "#5c7bff",
          500: "#3d5cff",
          600: "#2c42e0",
          700: "#2233b3",
          800: "#1c2a8c",
          900: "#182466",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
