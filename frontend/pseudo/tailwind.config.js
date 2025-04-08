/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
        card: "0 10px 15px -3px rgba(0, 0, 0, 0.05)",
      },
      colors: {
        primary: {
          DEFAULT: '#000000', // Black for icons
          accent: '#0000FF', // Blue for indicators
        },
        background: {
          DEFAULT: '#FFFFFF', // White background
        },
        text: {
          DEFAULT: '#000000', // Black text
        },
        indicator: {
          active: '#0000FF', // Blue for active indicators
          inactive: '#808080', // Gray for inactive indicators
        }
      },
    },
    borderRadius: {
      none: "0",
      sm: "0.125rem",
      DEFAULT: "0.25rem",
      md: "0.375rem",
      lg: "0.5rem",
      xl: "0.75rem",
      "2xl": "1rem",
      full: "9999px",
      lg: "var(--radius)",
      md: "calc(var(--radius) - 2px)",
      sm: "calc(var(--radius) - 4px)",
      "2xl": "1.5rem",
    },
  },
  plugins: [require("tailwindcss-animate")],
}

