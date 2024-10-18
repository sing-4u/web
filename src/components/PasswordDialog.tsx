import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
}

interface PasswordProps {
    oldPassword: string;
    newPassword: string;
}

const PasswordDialog = ({ isOpen, onClose }: DialogProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError
    } = useForm({
        defaultValues: {
            oldPassword: "",
            newPassword: ""
        }
    });

    const [confirmPassword, setConfirmPassword] = useState("");

    if (!isOpen) return null;

    const onSubmit = async (data: PasswordProps) => {
        const { oldPassword, newPassword } = data;
        if (newPassword === oldPassword) {
            setError("newPassword", {
                type: "custom",
                message: "비밀번호가 동일합니다."
            });
        }
        try {
            await axios.patch(
                `${import.meta.env.VITE_API_URL}/users/me/password`,
                { oldPassword, newPassword },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "accessToken"
                        )}`
                    }
                }
            );
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-[328px]">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">비밀번호 변경</h2>
                    <button onClick={onClose} className="text-gray-500">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            현재 비밀번호
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <input
                                {...register("oldPassword", {
                                    required: "비밀번호를 입력해주세요",
                                    pattern: {
                                        value: /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/,
                                        message:
                                            "비밀번호 취약: 비밀번호는 8~16자의 영문 대/소문자, 숫자, 특수문자를 모두 포함해야 합니다."
                                    }
                                })}
                                type="password"
                                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-3 pr-10 py-2 sm:text-sm border-gray-300 rounded-md"
                                placeholder="현재 비밀번호 입력"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-gray-400"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                    <path
                                        fillRule="evenodd"
                                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            새 비밀번호
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <input
                                {...register("newPassword", {
                                    required: "비밀번호를 입력해주세요",
                                    pattern: {
                                        value: /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/,
                                        message:
                                            "비밀번호 취약: 비밀번호는 8~16자의 영문 대/소문자, 숫자, 특수문자를 모두 포함해야 합니다."
                                    }
                                })}
                                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-3 pr-10 py-2 sm:text-sm border-gray-300 rounded-md"
                                placeholder="새 비밀번호 입력"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-gray-400"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                    <path
                                        fillRule="evenodd"
                                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700">
                            비밀번호 확인
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-3 pr-10 py-2 sm:text-sm border-gray-300 rounded-md"
                                placeholder="비밀번호 확인"
                            />
                            {errors.newPassword ? (
                                <p>{errors.newPassword.message}</p>
                            ) : null}
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-gray-400"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                    <path
                                        fillRule="evenodd"
                                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        변경하기
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PasswordDialog;
