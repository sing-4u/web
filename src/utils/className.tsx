import { FieldError } from "react-hook-form";

const getInputErrorClassName = (hasError: FieldError | undefined) => {
    return `border rounded-[10px] py-[14px] px-[18px] placeholder:font-Pretendard ${
        hasError ? "border-[#FF4242]" : "border-[#e1e1e1]"
    }`;
};

export default getInputErrorClassName;
