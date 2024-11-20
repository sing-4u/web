import { FieldValues, UseFormWatch, Path } from "react-hook-form";

interface UseFormValidationProps<T extends FieldValues> {
    watch: UseFormWatch<T>;
    fields: Array<Path<T>>;
    isLoading?: boolean;
}

export const useFormValidation = <T extends FieldValues>({
    watch,
    fields,
    isLoading = false
}: UseFormValidationProps<T>) => {
    const watchedFields = watch(fields);
    const isFormFilled = watchedFields.every((field) => field !== "");

    return {
        isValid: !(isLoading || !isFormFilled),
        isFormFilled
    };
};
