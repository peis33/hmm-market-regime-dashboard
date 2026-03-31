import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#14213D",
        mist: "#EEF3F7",
        cyan: "#3AAED8",
        mint: "#7BD389",
        coral: "#FF7F50",
        gold: "#F4B942",
      },
      boxShadow: {
        panel: "0 24px 80px -32px rgba(20, 33, 61, 0.35)",
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(20,33,61,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(20,33,61,0.08) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;
