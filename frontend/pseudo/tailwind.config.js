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
        white: {
          DEFAULT: '#FFFFFF', // background
        },
        black: {
          DEFAULT: '#18181B', // text
        },
        gray: {
          soft: '#E7E7E7', // 
        },
        red: {
          soft: '#FFE3E3', // 
          hard: '#FF4E4E', // 
        },
        green: {
          soft: '#DDFFD6', // 
          hard: '#2AB333', // 
        },
        orange: {
          soft: '#FFEBCB', // 
        },
        blue: {
          soft: '#D9D9FF', // 
        }
      },
      
      fontFamily: {
        sans: ['Montserrat'], // Default font
        montserrat: ['Montserrat'], // Optional: if you want to explicitly use montserrat class
      },
      
      fontSize: {
        'xxs': ['10px', { lineHeight: '14px' }],
        'xs': ['12px', { lineHeight: '16px' }],
        'sm': ['14px', { lineHeight: '20px' }],
        'base': ['16px', { lineHeight: '24px' }],
        'lg': ['18px', { lineHeight: '28px' }],
        'xl': ['24px', { lineHeight: '32px' }],
        '2xl': ['32px', { lineHeight: '40px' }],
      },
    },
    borderRadius: {
      none: "0",
      sm: "calc(var(--radius) - 4px)",
      md: "calc(var(--radius) - 2px)",
      DEFAULT: "0.25rem",
      lg: "var(--radius)",
      xl: "0.75rem",
      "2xl": "1.5rem",
      full: "9999px",
    },
  },
  plugins: [require("tailwindcss-animate")],
}

