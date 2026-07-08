import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        app: {
          bg: "#f6f7fb",
          ink: "#111827",
          muted: "#6b7280",
          line: "#e5e7eb",
          paper: "#ffffff",
          teal: "#0f766e",
          coral: "#f97316",
          blue: "#2563eb",
        },
      },
      boxShadow: {
        app: "0 18px 60px rgba(17, 24, 39, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
