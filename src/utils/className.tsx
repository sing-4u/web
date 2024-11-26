import { FieldError } from "react-hook-form";

const getInputErrorClassName = (hasError: FieldError | undefined) => {
    return `border rounded-lg h-[56px] px-[18px] py-[16px] placeholder:text-inputTextColor ${
        hasError ? "border-[#FF4242]" : "border-inputBorderColor"
    }`;
};

export default getInputErrorClassName;
