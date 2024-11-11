import { FieldError } from "react-hook-form";

const getInputErrorClassName = (hasError: FieldError | undefined) => {
    return `border rounded-[10px] p-[18px] placeholder:font-Pretendard ${
        hasError ? "border-[#FF4242]" : "border-black"
    }`;
};

export default getInputErrorClassName;
