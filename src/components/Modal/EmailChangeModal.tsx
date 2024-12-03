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
import ErrorMessage from "../ErrorMessage";

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
            if (axios.isAxiosError(error) && error.response?.status === 409) {
                setError("email", {
                    type: "manual",
                    message: "이미 존재하는 이메일입니다."
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
                                required: "이메일 주소를 입력해주세요.",
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
                        {errors.email && (
                            <p className="mt-1 text-sm text-errorTextColor">
                                {errors?.email.message}
                            </p>
                        )}
                    </div>
                </label>
            </div>

            <div>
                <label className="block mb-2 text-sm text-gray-700">
                    비밀번호
                    <div className="flex flex-col">
                        <div className="relative top-2">
                            <input
                                type={passwordState.type}
                                {...register("password", {
                                    required:
                                        "본인임을 인증하기 위해 비밀번호를 입력해주세요."
                                })}
                                className={`w-full my-2 ${getInputErrorClassName(
                                    errors.password
                                )}`}
                                placeholder="비밀번호를 입력해주세요."
                            />
                            <ErrorMessage field="password" errors={errors} />
                            <button
                                type="button"
                                disabled={isLoading}
                                className="h-5 w-5 absolute right-4 top-1/2 transform -translate-y-1/2"
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
