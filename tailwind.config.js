/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        mobile: { min: "376px", max: "767px" },
        tablet: { min: "768px", max: "1439px" },
        pc: { min: "1440px" },
      },
      fontFamily: {
        sans: ["Pretendard"],
        pretendard: ["Pretendard"],
      },
      colors: {
        customGray: "#888888",
        inputBorderColor: "#E1E1E1",
        inputTextColor: "#AAAAAA",
        buttonColor: "#F5F5F5",
        buttonColor2: "#D9D9D9",
        colorPurple: "#7846DD",
        textColor: "#ffffff",
        errorTextColor: "#ff4242",
        colorPurpleHover: "#6432c9",
      },
      customGradient: {
        start: "#7B92C7",
        middle: "#7846DD",
        end: "#BB7FA0",
      },
      keyframes: {
        fadeIn: {
          "0%": {
            opacity: "0",
            transform: "translate(-50%, -90%)",
          },
          "100%": {
            opacity: "1",
            transform: "translate(-50%, -100%)",
          },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease-in-out",
        fadeOut: "fadeOut 1.5s ease-in-out",
      },
    },
  },
  variants: {},
  plugins: [],
};
