/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            screens: {
                extraSmall: "375px",
                tablet: "768px",
                pc: "1440px"
            },
            fontFamily: {
                sans: ["Pretendard", "system-ui", "sans-serif"], // 기본 폰트로 Pretendard 설정
                pretendard: ["Pretendard"]
            },
            colors: {
                customGray: "#888888",
                inputBorderColor: "#E1E1E1",
                inputTextColor: "#AAAAAA",
                buttonColor: "#F5F5F5",
                buttonColor2: "#D9D9D9",
                colorPurple: "#7846DD",
                textColor: "#ffffff"
            },
            customGradient: {
                start: "#7B92C7",
                middle: "#7846DD",
                end: "#BB7FA0"
            }
        }
    },
    variants: {},
    plugins: []
};
