import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Mobile-first design - 390x844 viewport as baseline
      screens: {
        'xs': '375px',
        'sm': '390px',
        'md': '768px',
        'lg': '1024px',
      },
    },
  },
  plugins: [],
};

export default config;
