import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "brand-purple": "#49317A",
      },
      fontFamily: {
        "red-hat-text": ['"Red Hat Text"', "sans-serif"],
        "red-hat-display": ['"Red Hat Display"', "sans-serif"],
      },
      keyframes: {
        "slide-in-from-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-out-to-right": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(100%)" },
        },
        "slide-in-from-left": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-out-to-left": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-100%)" },
        },
        "slide-in-from-top": {
          from: { transform: "translateY(-100%)" },
          to: { transform: "translateY(0)" },
        },
        "slide-out-to-top": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(-100%)" },
        },
        "slide-in-from-bottom": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        "slide-out-to-bottom": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(100%)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-out": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        "slide-down": {
          from: { maxHeight: "0", opacity: "0" },
          to: { maxHeight: "200px", opacity: "1" },
        },
      },
      animation: {
        "slide-in-from-right": "slide-in-from-right 0.3s ease-in-out",
        "slide-out-to-right": "slide-out-to-right 0.3s ease-in-out",
        "slide-in-from-left": "slide-in-from-left 0.3s ease-in-out",
        "slide-out-to-left": "slide-out-to-left 0.3s ease-in-out",
        "slide-in-from-top": "slide-in-from-top 0.3s ease-in-out",
        "slide-out-to-top": "slide-out-to-top 0.3s ease-in-out",
        "slide-in-from-bottom": "slide-in-from-bottom 0.3s ease-in-out",
        "slide-out-to-bottom": "slide-out-to-bottom 0.3s ease-in-out",
        "fade-in": "fade-in 0.2s ease-in-out",
        "fade-out": "fade-out 0.2s ease-in-out",
        "slide-down": "slide-down 0.4s ease-out forwards",
      },
    },
  },
  plugins: [],
} satisfies Config;
