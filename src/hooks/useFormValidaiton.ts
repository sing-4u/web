import { FieldValues, UseFormWatch, FieldPath } from "react-hook-form";

interface UseFormValidationProps<T extends FieldValues> {
    watch: UseFormWatch<T>;
    fields: FieldPath<T>[];
    isLoading?: boolean;
    provider?: "GOOGLE" | string;
}

export const useFormValidation = <T extends FieldValues>({
    watch,
    fields,
    provider
}: UseFormValidationProps<T>) => {
    return provider === "GOOGLE"
        ? !watch(fields)[0]
        : Object.values(watch(fields)).some((value) => !value);
};
