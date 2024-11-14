import { FieldError } from "react-hook-form";

const getInputErrorClassName = (hasError: FieldError | undefined) => {
    return `border rounded-lg py-[14px] px-[18px] placeholder:text-inputTextColor ${
        hasError ? "border-[#FF4242]" : "border-[#e1e1e1]"
    }`;
};

export default getInputErrorClassName;
