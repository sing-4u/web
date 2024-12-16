import axios from "axios";
import { useToast } from "../hooks/useToast";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import usePasswordToggle from "../hooks/usePasswordToggle";
import getInputErrorClassName from "../utils/className";
import axiosInstance from "../utils/axiosInstance";
import { ToastContainer } from "../components/ToastContainer";
import Navbar from "../components/Navbar";
import { useTitle } from "../hooks/useTitle";
import Logo from "../components/Logo";
import NavbarWithoutLoginButton from "../components/NavBarWithoutLoginButton";
import { useFormValidation } from "../hooks/useFormValidaiton";

interface PasswordProps {
    newPassword: string;
    confirmPassword?: string;
}

const NewPassword = () => {
    const setTitle = useTitle();

    setTimeout(() => {
        setTitle("새 비밀번호 설정");
    }, 100);
    const { state } = useLocation();
    const { accessToken } = state;
    const { showToast, toasts } = useToast();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm<PasswordProps>();

    const {
        passwordState: newPassword,
        handleToggle,
        handleEyeIconToggle
    } = usePasswordToggle();

    const {
        passwordState: confirmPassword,
        handleToggle: handleConfirmToggle,
        handleEyeIconToggle: handleConfirmEyeIconToggle
    } = usePasswordToggle();

    const onSubmit = async ({ newPassword }: PasswordProps) => {
        try {
            await axiosInstance(accessToken).patch("/auth/password", {
                newPassword
            });
            navigate("/?showToast=passwordChanged", { replace: true });
        } catch (error) {
            if (error instanceof Error) throw new Error(error.message);
            // 401 에러 처리
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                showToast("error", "비밀번호 변경에 실패했습니다.");
            }
        }
    };

    const isButtonDisabled = useFormValidation({
        watch,
        fields: ["newPassword", "confirmPassword"]
    });

    return (
        <div className="w-full relative">
            <NavbarWithoutLoginButton />
            <ToastContainer toasts={toasts} />
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-md mx-auto p-6"
            >
                <div className="">
                    <div className="text-2xl font-bold text-center mobile:mt-[22px] mobile:text-[28px] pc:mt-4 pc:text-[32px]">
                        비밀번호 재설정
                    </div>

                    <div className="relative flex flex-col mt-[60px]">
                        <label htmlFor="newPassword" className="text-left mb-2">
                            새 비밀번호
                        </label>
                        <input
                            type={newPassword.type}
                            id="newPassword"
                            placeholder="새 비밀번호"
                            className={`mb-2 ${getInputErrorClassName(
                                errors.newPassword
                            )} text-[16px]`}
                            {...register("newPassword", {
                                required: "비밀번호를 입력해주세요.",
                                pattern: {
                                    value: /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/,
                                    message:
                                        "8~16자의 영문 대/소문자, 숫자, 특수문자를 조합하여 입력해주세요."
                                }
                            })}
                        />
                        {errors.newPassword ? (
                            <span className="text-red-500 text-[12px]">
                                {errors.newPassword.message}
                            </span>
                        ) : null}
                        <span className="flex justify-end items-center">
                            <img
                                src={handleEyeIconToggle()}
                                alt="Toggle Password Visibility"
                                className="absolute inset-y-12 end-3"
                                onClick={handleToggle}
                            />
                        </span>
                    </div>
                    <div className="relative flex flex-col">
                        <label
                            htmlFor="confirmPassword"
                            className="text-left mb-2"
                        >
                            새 비밀번호 확인
                        </label>
                        <input
                            id="confirmPassword"
                            type={confirmPassword.type}
                            placeholder="새 비밀번호 확인"
                            className={`mb-2 ${getInputErrorClassName(
                                errors.confirmPassword
                            )} text-[16px]`}
                            {...register("confirmPassword", {
                                required: "비밀번호를 입력해주세요.",
                                validate: (value) =>
                                    value === watch("newPassword") ||
                                    "비밀번호가 일치하지 않습니다."
                            })}
                        />
                        {errors.confirmPassword ? (
                            <span className="text-red-500 text-[12px]">
                                {errors.confirmPassword.message}
                            </span>
                        ) : null}

                        <span className="flex justify-end items-center">
                            <img
                                src={handleConfirmEyeIconToggle()}
                                alt="Toggle Password Visibility"
                                className="absolute inset-y-12 end-3"
                                onClick={handleConfirmToggle}
                            />
                        </span>
                    </div>

                    <button
                        disabled={isButtonDisabled}
                        className="font-bold w-full bg-colorPurple disabled:bg-buttonColor2 disabled:cursor-not-allowed text-textColor rounded-lg h-[52px] mt-10"
                        type="submit"
                    >
                        비밀번호 변경하기
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewPassword;
