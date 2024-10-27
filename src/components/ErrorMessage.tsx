import { FieldErrors, FieldName } from "react-hook-form";

interface FormValues {
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
}

interface ErrorMessageProps<T extends FieldName<FormValues>> {
    field: T;
    errors: FieldErrors<FormValues>;
}

const ErrorMessage = <T extends FieldName<FormValues>>({
    field,
    errors
}: ErrorMessageProps<T>) => {
    return <p className="text-red-500">{errors[field]?.message}</p>;
};

export default ErrorMessage;
