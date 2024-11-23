import { FieldErrors, FieldName } from "react-hook-form";

interface FormValues {
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
    oldPassword: string;
    newPassword: string;
    code: string;
}

interface ErrorMessageProps<T extends FieldName<FormValues>> {
    field?: T;
    errors: FieldErrors<FormValues> | string;
}

const ErrorMessage = <T extends FieldName<FormValues>>({
    field,
    errors
}: ErrorMessageProps<T>) => {
    if (typeof errors === "string") {
        return <p className="text-red-500">{errors}</p>;
    }

    if (!field || !errors[field]) return null;
    return <p className="text-red-500">{errors[field]?.message || ""}</p>;
};

export default ErrorMessage;
