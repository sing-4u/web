import React from "react";
import { useFormContext, RegisterOptions } from "react-hook-form";
import usePasswordToggle from "../hooks/usePasswordToggle";

interface FormFieldProps {
    label: string;
    name: string;
    type: string;
    placeholder: string;
    rules?: RegisterOptions;
}

const FormField = ({
    label,
    name,
    type,
    placeholder,
    rules
}: FormFieldProps) => {
    const {
        register,
        formState: { errors }
    } = useFormContext();
    const { passwordState, handleToggle } = usePasswordToggle();

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
                <input
                    {...register(name, rules)}
                    type={type === "password" ? passwordState.type : type}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-3 pr-10 py-2 sm:text-sm border-gray-300 rounded-md"
                    placeholder={placeholder}
                />
                {errors[name] && (
                    <p className="text-red-500">
                        {errors[name]?.message?.toString()}
                    </p>
                )}
                {type === "password" && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center hover:cursor-pointer">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            onClick={handleToggle}
                        >
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path
                                fillRule="evenodd"
                                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FormField;
