import { FieldValues, UseFormWatch, FieldPath } from "react-hook-form";

interface UseFormValidationProps<T extends FieldValues> {
    watch: UseFormWatch<T>;
    fields: FieldPath<T>[];
    isLoading?: boolean;
}

export const useFormValidation = <T extends FieldValues>({
    watch,
    fields
}: UseFormValidationProps<T>) => {
    return Object.values(watch(fields)).some((value) => !value);
};
