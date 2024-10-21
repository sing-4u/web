import { useForm } from "react-hook-form";
import axiosInstance from "../../utils/axiosInstance";
import getInputErrorClassName from "../../utils/className";
import { DialogContentProps } from "../../types";
import usePasswordToggle from "../../hooks/usePasswordToggle";

const PasswordDialogContent = ({ onClose }: DialogContentProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm({
        defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" }
    });

    const watchPassword = watch("newPassword");
    const watchOldPassword = watch("oldPassword");

    const onSubmit = async (data: {
        oldPassword: string;
        newPassword: string;
        confirmPassword: string;
    }) => {
        const { oldPassword, newPassword } = data;
        try {
            await axiosInstance.patch("/users/me/password", {
                oldPassword,
                newPassword
            });
            onClose();
        } catch {
            // error handling
        }
    };

    const { passwordState, handleToggle } = usePasswordToggle();
    const {
        passwordState: confirmPasswordState,
        handleToggle: handleConfirmToggle
    } = usePasswordToggle();
    const { passwordState: oldPasswordState, handleToggle: handleOldToggle } =
        usePasswordToggle();

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    현재 비밀번호
                </label>
                <div className="flex flex-col relative">
                    <input
                        {...register("oldPassword", {
                            required: "비밀번호는 필수값입니다.",
                            pattern: {
                                value: /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/,
                                message:
                                    "비밀번호 취약: 비밀번호는 8~16자의 영문 대/소문자, 숫자, 특수문자를 모두 포함해야 합니다."
                            }
                        })}
                        type="password"
                        className={`mb-2 ${getInputErrorClassName(
                            errors.oldPassword
                        )}`}
                        placeholder="비밀번호를 입력해주세요."
                    />
                    {errors.oldPassword && (
                        <p className="text-red-500">
                            {errors.oldPassword.message}
                        </p>
                    )}
                    {oldPasswordState.type === "password" && (
                        <div className="absolute top-4 right-0 pr-3 flex items-center hover:cursor-pointer">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-gray-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                onClick={handleOldToggle}
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
            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    새 비밀번호
                </label>
                <div className="flex flex-col relative">
                    <input
                        {...register("newPassword", {
                            required: "비밀번호는 필수값입니다.",
                            pattern: {
                                value: /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/,
                                message:
                                    "비밀번호 취약: 비밀번호는 8~16자의 영문 대/소문자, 숫자, 특수문자를 모두 포함해야 합니다."
                            },
                            validate: (value) =>
                                value !== watchOldPassword ||
                                "새 비밀번호와 현재 비밀번호가 일치합니다. 다시 확인해주세요."
                        })}
                        type="password"
                        className={`mb-2 ${getInputErrorClassName(
                            errors.newPassword
                        )}`}
                        placeholder="새 비밀번호를 입력해주세요."
                    />
                    {errors.newPassword && (
                        <p className="text-red-500">
                            {errors.newPassword.message}
                        </p>
                    )}
                    {passwordState.type === "password" && (
                        <div className="absolute top-4 right-0 pr-3 flex items-center hover:cursor-pointer">
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
            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    새 비밀번호 확인
                </label>
                <div className="flex flex-col relative">
                    <input
                        {...register("confirmPassword", {
                            required: "비밀번호는 필수값입니다.",
                            validate: (value) =>
                                value === watchPassword ||
                                "비밀번호가 일치하지 않습니다."
                        })}
                        type="password"
                        className={`mb-2 ${getInputErrorClassName(
                            errors.confirmPassword
                        )}`}
                        placeholder="새 비밀번호를 다시 입력해주세요."
                    />
                    {errors.confirmPassword && (
                        <p className="text-red-500">
                            {errors.confirmPassword.message}
                        </p>
                    )}
                    {confirmPasswordState.type === "password" && (
                        <div className="absolute top-4 right-0 pr-3 flex items-center hover:cursor-pointer">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-gray-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                onClick={handleConfirmToggle}
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
            <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                변경하기
            </button>
        </form>
    );
};

export default PasswordDialogContent;
