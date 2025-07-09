import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        gold: {
          DEFAULT: "#D4AF37",
          50: "#F9F6E6",
          100: "#F3EDCD",
          200: "#E7DB9B",
          300: "#DBC969",
          400: "#D4AF37",
          500: "#B8922C",
          600: "#9C7A25",
          700: "#80621E",
          800: "#644A17",
          900: "#483210",
        },
        burgundy: {
          DEFAULT: "#8B0000",
          50: "#FFE5E5",
          100: "#FFCCCC",
          200: "#FF9999",
          300: "#FF6666",
          400: "#CC0000",
          500: "#8B0000",
          600: "#730000",
          700: "#5A0000",
          800: "#420000",
          900: "#290000",
        },
        black: {
          DEFAULT: "#1A1A1A",
          50: "#F5F5F5",
          100: "#E5E5E5",
          200: "#CCCCCC",
          300: "#B3B3B3",
          400: "#999999",
          500: "#666666",
          600: "#4D4D4D",
          700: "#333333",
          800: "#1A1A1A",
          900: "#0D0D0D",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["'Playfair Display'", "serif"],
        playfair: ["'Playfair Display'", "serif"],
        inter: ["Inter", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "fade-up": "fadeUp 0.5s ease-out",
        "slide-in": "slideIn 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      backgroundColor: {
        'gold': '#D4AF37',
      },
      textColor: {
        'gold': '#D4AF37',
      },
      borderColor: {
        'gold': '#D4AF37',
      },
    },
  },
  plugins: [],
} satisfies Config;