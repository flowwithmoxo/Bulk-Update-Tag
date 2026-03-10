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
          bg: "#FCFAFA",
          heading: "#3E3C3A",
          body: "#5B5A58",
          btn: "#77736F",
          "btn-hover": "#5B5A58",
          cyan: "#3AA9E5",
          blue: "#67D4F4",
          border: "#C7C3C0",
        }
      },
      borderRadius: {
        'moxo': '10px',
      }
    },
  },
  plugins: [],
};

export default config;
