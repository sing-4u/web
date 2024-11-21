import { FieldValues, UseFormWatch, FieldPath } from "react-hook-form";

interface UseFormValidationProps<T extends FieldValues> {
    watch: UseFormWatch<T>;
    fields: FieldPath<T>[];
    isLoading?: boolean;
}

export const useFormValidation = <T extends FieldValues>({
    watch,
    fields,
    isLoading = false
}: UseFormValidationProps<T>) => {
    const isFormFilled = watch(fields).every((field) => field !== "");

    return { isValid: !(isLoading || !isFormFilled) };
};
