import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        moxo: {
          bg: "#F8F9FA",
          sidebar: "#2C2A28",
          "sidebar-hover": "#3E3C3A",
          heading: "#3E3C3A",
          body: "#77736F",
          "body-light": "#9B9894",
          btn: "#3E3C3A",
          "btn-hover": "#2C2A28",
          cyan: "#3AA9E5",
          "cyan-light": "#EBF6FD",
          border: "#E8E5E3",
          "border-light": "#F0EEED",
          card: "#FFFFFF",
          success: "#2D9D78",
          "success-bg": "#EEFBF5",
          error: "#E5484D",
          "error-bg": "#FFF0F0",
        },
      },
      borderRadius: {
        moxo: "10px",
        "moxo-lg": "14px",
      },
      boxShadow: {
        moxo: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)",
        "moxo-md":
          "0 4px 12px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)",
        "moxo-lg":
          "0 8px 24px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.03)",
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],
      },
    },
  },
  plugins: [],
};

export default config;
