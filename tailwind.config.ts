import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      primary: "#8E9A34",
      primary2: "#284E2D",
      secondary: "#FDD61D",
      secondary2: "#33312D",
      secondary3: "#2A502F",
      tertiary: "#393B6F88",
      highlight: "#BFFA43",
      back: "#0B1315",
      back2: "#151515",
      back3: "#18182E",
      front: "#FFF",
      front2: "#888",
      dangerous: "#DC143C",
      transparent: "#fff0",
      black: "#000",
      walletbutton: "#512DA8",
      white: "#fff",
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
