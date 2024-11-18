import { useForm } from "react-hook-form";
import getInputErrorClassName from "../../utils/className";
import usePasswordToggle from "../../hooks/usePasswordToggle";
import axiosInstance from "../../utils/axiosInstance";
import { useToast } from "../../hooks/useToast";
import { ToastContainer } from "../ToastContainer";
import { ModalContentProps } from "../../types";
import { useState } from "react";
import { useModal } from "../../hooks/useModal";

const EmailChangeModal = ({
    buttonBackgroundColor
}: ModalContentProps<unknown>) => {
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

    const { closeModal } = useModal();

    const [isLoading, setIsLoading] = useState(false);

    const { showToast, toasts } = useToast();

    const onSubmit = async (data: { email: string; password: string }) => {
        const { email, password } = data;

        try {
            setIsLoading(true);
            await axiosInstance().patch("/users/me/email", { email, password });

            showToast("success", "이메일 변경 완료");
            closeModal();
        } catch {
            // error handling
        } finally {
            setIsLoading(false);
        }
    };

    const { passwordState, handleToggle, handleEyeIconToggle } =
        usePasswordToggle();

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-y-4 rounded-[10px]"
        >
            <ToastContainer toasts={toasts} />
            <div>
                <label className="block *:text-sm text-gray-700">
                    새 이메일
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
                            className={`my-2 ${getInputErrorClassName(
                                errors.email
                            )}`}
                            placeholder="이메일 입력"
                        />
                        {errors.email ? (
                            <p className="text-red-500">
                                {errors.email.message}
                            </p>
                        ) : null}
                    </div>
                </label>
            </div>

            <div>
                <label className="block text-sm text-gray-700">
                    비밀번호
                    <div className="flex flex-col">
                        <div className="relative">
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
                                className={`w-full my-2 ${getInputErrorClassName(
                                    errors.password
                                )}`}
                                placeholder="비밀번호를 입력해주세요."
                            />
                            {errors.password ? (
                                <p className="text-red-500">
                                    {errors.password.message}
                                </p>
                            ) : null}

                            <button
                                type="button"
                                disabled={isLoading}
                                className="absolute top-8 -translate-y-1/2 right-0 pr-3 flex items-center"
                                onClick={handleToggle}
                            >
                                <img
                                    src={handleEyeIconToggle()}
                                    alt="toggle password visibility"
                                    className="h-5 w-5"
                                />
                            </button>
                        </div>
                    </div>
                </label>
            </div>

            <button
                type="submit"
                className={`mt-8 w-full h-[52px] flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium  ${buttonBackgroundColor} text-white hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
                {isLoading ? "변경 중" : "변경하기"}
            </button>
        </form>
    );
};

export default EmailChangeModal;
