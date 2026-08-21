import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#12372A", // أخضر غامق
          light: "#1c5240",
        },
        cream: "#F5F1EB", // بيج فاتح
        accent: "#C1272D", // أحمر
      },
      fontFamily: {
        arabic: ["var(--font-arabic)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
