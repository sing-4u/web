/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ["Pretendard"],
      },
      colors: {
        customGray: "#888888",
        inputBorderColor: "#E1E1E1",
        inputTextColor: "#AAAAAA",
      },
    },
  },
  plugins: [],
};
