import { FieldErrors } from "react-hook-form";

interface FormValues {
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
    oldPassword: string;
    newPassword: string;
    code: string;
}

interface ErrorMessageProps {
    field?: keyof FormValues;
    errors: FieldErrors<FormValues> | string;
}

const ErrorMessage = ({ field, errors }: ErrorMessageProps) => {
    if (typeof errors === "string") {
        return <p className="text-red-500">{errors}</p>;
    }

    if (!field || !errors[field]) return null;
    return <p className="text-red-500">{errors[field]?.message || ""}</p>;
};

export default ErrorMessage;
