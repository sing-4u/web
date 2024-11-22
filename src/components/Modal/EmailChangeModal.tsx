import { useForm } from "react-hook-form";
import getInputErrorClassName from "../../utils/className";
import usePasswordToggle from "../../hooks/usePasswordToggle";
import axiosInstance from "../../utils/axiosInstance";
import { useToast } from "../../hooks/useToast";
import { ToastContainer } from "../ToastContainer";
import { ModalContentProps } from "../../types";
import { useState } from "react";
import { useModal } from "../../hooks/useModal";
import axios from "axios";
import { useFormValidation } from "../../hooks/useFormValidaiton";
import ChangeButtonInModal from "./Button/ChangeButtonInModal";

const EmailChangeModal = ({
    buttonBackgroundColor
}: ModalContentProps<unknown>) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        watch
    } = useForm({
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: ""
        }
    });

    const { isValid } = useFormValidation({
        watch,
        fields: ["email", "password"],
        isLoading: false
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
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                setError("password", {
                    type: "manual",
                    message: "비밀번호가 일치하지 않습니다."
                });
            }
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
                            type="email"
                            {...register("email", {
                                required: "이메일은 필수값입니다.",
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: "올바른 이메일 형식이 아닙니다."
                                }
                            })}
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
                                type={passwordState.type}
                                {...register("password", {
                                    required:
                                        "본인임을 인증하기 위해 비밀번호를 입력해주세요.",
                                    pattern: {
                                        value: /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/,
                                        message:
                                            "비밀번호 취약: 비밀번호는 8~16자의 영문 대/소문자, 숫자, 특수문자를 모두 포함해야 합니다."
                                    }
                                })}
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

            <ChangeButtonInModal
                isLoading={isLoading}
                isValid={!isValid}
                buttonBackgroundColor={buttonBackgroundColor}
            />
        </form>
    );
};

export default EmailChangeModal;
