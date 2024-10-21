import { useForm } from "react-hook-form";
import Dialog, { DialogProps } from "./Dialog";
import axios from "axios";
import getInputErrorClassName from "../../utils/className";
import usePasswordToggle from "../../hooks/usePasswordToggle";

const EmailDialog = ({ isOpen, onClose }: DialogProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: ""
        }
    });

    const onSubmit = async (data: { email: string; password: string }) => {
        const { email, password } = data;

        try {
            await axios.patch(
                `${import.meta.env.VITE_API_URL}/users/me/email`,
                { email, password },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "accessToken"
                        )}`
                    }
                }
            );
            onClose();
        } catch {
            // error handling
        }
    };

    const { passwordState, handleToggle } = usePasswordToggle();

    return (
        <Dialog isOpen={isOpen} onClose={onClose} title="이메일 변경">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        이메일
                    </label>

                    <div className="flex flex-col">
                        <input
                            {...register("email", {
                                required: "이메일은 필수값입니다.",
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: "올바른 이메일 형식이 아닙니다."
                                }
                            })}
                            type="email"
                            className={`mb-2 ${getInputErrorClassName(
                                errors.email
                            )}`}
                            placeholder="이메일을 입력해주세요."
                        />
                        {errors.email ? (
                            <p className="text-red-500">
                                {errors.email.message}
                            </p>
                        ) : null}
                    </div>
                </div>

                <div>
                    <label className="my-2 block text-sm font-medium text-gray-700">
                        비밀번호
                    </label>
                    <div className="flex flex-col">
                        <input
                            {...register("password", {
                                required: "비밀번호는 필수값입니다.",
                                pattern: {
                                    value: /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/,
                                    message:
                                        "비밀번호 취약: 비밀번호는 8~16자의 영문 대/소문자, 숫자, 특수문자를 모두 포함해야 합니다."
                                }
                            })}
                            type={passwordState.type}
                            className={`mb-2 ${getInputErrorClassName(
                                errors.password
                            )}`}
                            placeholder="비밀번호를 입력해주세요."
                        />
                        {errors.password ? (
                            <p className="text-red-500">
                                {errors.password.message}
                            </p>
                        ) : null}
                        {passwordState.type === "password" && (
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

                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    변경하기
                </button>
            </form>
        </Dialog>
    );
};

export default EmailDialog;
