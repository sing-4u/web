import { useForm } from "react-hook-form";
import axiosInstance from "../../utils/axiosInstance";
import getInputErrorClassName from "../../utils/className";
import usePasswordToggle from "../../hooks/usePasswordToggle";
import { useToast } from "../../hooks/useToast";
import { ToastContainer } from "../ToastContainer";
import { ModalContentProps } from "../../types";
import { useState } from "react";
import { useModal } from "../../hooks/useModal";
import axios from "axios";
import { useFormValidation } from "../../hooks/useFormValidaiton";
import ChangeButtonInModal from "./Button/ChangeButtonInModal";
import ErrorMessage from "../ErrorMessage";
import { useNavigate } from "react-router-dom";

const PasswordChangeModal: React.FC<ModalContentProps<unknown>> = ({
    navigate,
    buttonBackgroundColor
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setError
    } = useForm({
        defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" }
    });

    const { isValid } = useFormValidation({
        watch,
        fields: ["oldPassword", "newPassword", "confirmPassword"],
        isLoading: false
    });

    const { closeModal } = useModal();

    const [isLoading, setIsLoading] = useState(false);

    const { showToast, toasts } = useToast();

    const watchPassword = watch("newPassword");
    const watchOldPassword = watch("oldPassword");

    const onSubmit = async (data: {
        oldPassword: string;
        newPassword: string;
        confirmPassword: string;
    }) => {
        const { oldPassword, newPassword } = data;
        try {
            setIsLoading(true);
            // TODO : 비밀번호 변경 시 로그아웃 처리 되는 부분 확인(배포에서만 로그아웃 처리됨)
            await axiosInstance().patch("/users/me/password", {
                oldPassword,
                newPassword
            });
            showToast("success", "비밀번호 변경 완료");
            closeModal();
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                setError("oldPassword", {
                    type: "manual",
                    message: "현재 비밀번호가 일치하지 않습니다."
                });
            }
        } finally {
            setIsLoading(false);
        }
    };
    // const isValid = isLoading || !isFormFilled;

    const {
        passwordState: oldPasswordState,
        handleToggle: handleOldToggle,
        handleEyeIconToggle: handleOldEyeIconToggle
    } = usePasswordToggle();

    const {
        passwordState: newPasswordState,
        handleToggle: handleNewToggle,
        handleEyeIconToggle: handleNewEyeIconToggle
    } = usePasswordToggle();

    const {
        passwordState: confirmPasswordState,
        handleToggle: handleConfirmToggle,
        handleEyeIconToggle: handleConfirmEyeIconToggle
    } = usePasswordToggle();

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-y-4 rounded-[10px]"
        >
            <ToastContainer toasts={toasts} />
            <div>
                <label className="mb-2 block text-sm text-gray-700">
                    현재 비밀번호
                    <div className="flex flex-col">
                        <div className="relative">
                            <input
                                type={oldPasswordState.type}
                                {...register("oldPassword", {
                                    required: "비밀번호를 입력해주세요.",
                                    validate: (value) => {
                                        if (value === "") {
                                            return "비밀번호를 입력해주세요.";
                                        }
                                        if (value !== watchOldPassword) {
                                            return "비밀번호가 일치하지 않습니다.";
                                        }
                                    }
                                })}
                                className={`w-full my-2 ${getInputErrorClassName(
                                    errors.oldPassword
                                )}`}
                                placeholder="비밀번호 입력"
                            />

                            <img
                                src={handleOldEyeIconToggle()}
                                alt="toggle password visibility"
                                className="h-5 w-5 absolute right-4 top-1/2 transform -translate-y-1/2"
                                onClick={handleOldToggle}
                            />
                        </div>
                        {errors.oldPassword && (
                            <p className="mt-1 text-sm text-errorTextColor">
                                {errors.oldPassword.message}
                            </p>
                        )}
                    </div>
                </label>
            </div>

            <div>
                <label className="mb-2 block text-sm text-gray-700">
                    새 비밀번호
                    <div className="flex flex-col">
                        <div className="relative">
                            <input
                                type={newPasswordState.type}
                                {...register("newPassword", {
                                    required: "비밀번호를 입력해 주세요.",
                                    pattern: {
                                        value: /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/,
                                        message:
                                            "8~16자의 영문 대/소문자, 숫자, 특수문자를 조합하여 입력해주세요."
                                    },
                                    validate: (value) => {
                                        if (value === "") {
                                            return "8~16자의 영문 대/소문자, 숫자, 특수문자를 조합하여 입력해주세요.";
                                        }
                                        if (value === watchOldPassword) {
                                            return "새 비밀번호가 현재 비밀번호와 동일합니다. 다시 확인해주세요.";
                                        }
                                    }
                                })}
                                className={`w-full my-2 ${getInputErrorClassName(
                                    errors.newPassword
                                )}`}
                                placeholder="새 비밀번호 입력"
                            />

                            <img
                                src={handleNewEyeIconToggle()}
                                alt="toggle password visibility"
                                className="h-5 w-5 absolute right-4 top-1/2 transform -translate-y-1/2"
                                onClick={handleNewToggle}
                            />
                        </div>

                        {errors.newPassword && (
                            <p className="mt-1 text-sm text-errorTextColor">
                                {errors.newPassword.message}
                            </p>
                        )}
                    </div>
                </label>
            </div>

            <div>
                <label className="mb-2 block text-sm text-gray-700">
                    새 비밀번호 확인
                    <div className="flex flex-col">
                        <div className="relative">
                            <input
                                {...register("confirmPassword", {
                                    required: "비밀번호는 필수값입니다.",

                                    validate: (value) => {
                                        if (value !== watchPassword) {
                                            return "비밀번호가 일치하지 않습니다.";
                                        }
                                    }
                                })}
                                type={confirmPasswordState.type}
                                className={`w-full my-2 ${getInputErrorClassName(
                                    errors.confirmPassword
                                )}`}
                                placeholder="새 비밀번호 확인"
                            />

                            <img
                                src={handleConfirmEyeIconToggle()}
                                alt="toggle password visibility"
                                className="h-5 w-5 absolute right-4 top-1/2 transform -translate-y-1/2"
                                onClick={handleConfirmToggle}
                            />
                        </div>
                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-errorTextColor">
                                {errors.confirmPassword.message}
                            </p>
                        )}
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

export default PasswordChangeModal;
