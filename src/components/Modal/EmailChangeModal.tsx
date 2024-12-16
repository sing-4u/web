import { useForm } from "react-hook-form";
import getInputErrorClassName from "../../utils/className";
import usePasswordToggle from "../../hooks/usePasswordToggle";
import axiosInstance from "../../utils/axiosInstance";
import { useToast } from "../../hooks/useToast";
import { ToastContainer } from "../ToastContainer";
import { ModalContentProps } from "../../types";
import { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import axios from "axios";
import ChangeButtonInModal from "./Button/ChangeButtonInModal";
import ErrorMessage from "../ErrorMessage";
import { UserData } from "../../hooks/useUserData";

const EmailChangeModal = ({
    buttonBackgroundColor
}: ModalContentProps<unknown>) => {
    const [provider, setProvider] = useState("");
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        watch
    } = useForm({
        defaultValues: {
            email: "",
            password: ""
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
            setTimeout(() => {
                closeModal();
            }, 300);
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

    useEffect(() => {
        const fetchUserData = async () => {
            const response = await axios.get<UserData>(
                `${import.meta.env.VITE_API_URL}/users/me`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "accessToken"
                        )}`
                    }
                }
            );
            setProvider(response.data.provider);
        };
        fetchUserData();
    }, []);

    const { passwordState, handleToggle, handleEyeIconToggle } =
        usePasswordToggle();

    const isButtonDisabled =
        !watch("email") || (provider !== "GOOGLE" && !watch("password"));

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-y-4 rounded-[10px]"
        >
            <ToastContainer toasts={toasts} />
            <div>
                <label className="block text-sm text-[#000000] font-medium mobile:text-[14px] pc:text-base">
                    새 이메일
                    <div className="flex flex-col mt-2">
                        <input
                            type="email"
                            {...register("email", {
                                required: "이메일 주소를 입력해주세요.",
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: "올바른 이메일 형식이 아닙니다."
                                }
                            })}
                            className={`w-full h-[52px] border border-inputBorderColor ${
                                errors.email
                                    ? "border-errorTextColor"
                                    : "border-customGray"
                            }
                      rounded-lg text-left placeholder:mobile:text-[14px] placeholder:mobile:font-normal placeholder:tablet:font-normal placeholder:pc:text-base placeholder:pc:font-normal placeholder:leading-[24px]
                      placeholder:pt-[14px] pl-[18px] ${
                          provider === "GOOGLE" && "mb-2"
                      } text-[16px] mobile:${
                                errors.email ? "" : "mb-[22px]"
                            } pc:${errors.email ? "" : "mb-[30px]"}
                      tablet:${errors.email ? "" : "mb-[22px]"}`}
                            placeholder="이메일 입력"
                        />
                        {errors.email && (
                            <p className="mt-2 text-sm text-errorTextColor font-normal mobile:text-xs pc:text-[14px]">
                                {errors?.email.message}
                            </p>
                        )}
                    </div>
                </label>
            </div>

            {provider !== "GOOGLE" && (
                <div>
                    <label className="block mb-2 text-sm text-[#000000] font-medium mobile:text-[14px] pc:text-base">
                        비밀번호
                        <div className="flex flex-col">
                            <div className="relative top-2">
                                <input
                                    type={passwordState.type}
                                    {...register("password", {
                                        required:
                                            "본인임을 인증하기 위해 비밀번호를 입력해주세요."
                                    })}
                                    className={`w-full h-[52px] border border-inputBorderColor text-inputTextColor ${
                                        errors.password
                                            ? "border-errorTextColor"
                                            : "border-customGray"
                                    }
                      rounded-lg text-left placeholder:mobile:text-[14px] placeholder:mobile:font-normal placeholder:pc:text-base placeholder:pc:font-normal placeholder:tablet:font-normal placeholder:leading-[24px]
                      placeholder:pt-[14px] pl-[18px] text-[16px] mobile:${
                          errors.email ? "" : "mb-[22px]"
                      } pc:${errors.email ? "" : "mb-[30px]"}
                      tablet:${errors.email ? "" : "mb-[22px]"}`}
                                    placeholder="비밀번호를 입력해주세요."
                                />

                                <button
                                    type="button"
                                    disabled={isLoading}
                                    className={`w-5 h-5 absolute right-4 transform -translate-y-1/2 ${
                                        errors.password
                                            ? "mobile:top-1/2 pc:top-1/2 tablet:top-1/2"
                                            : "mobile:bottom-7 pc:bottom-9 tablet:bottom-7"
                                    }`}
                                    onClick={handleToggle}
                                >
                                    <img
                                        src={handleEyeIconToggle()}
                                        alt="toggle password visibility"
                                        className="h-5 w-5"
                                    />
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-4 text-errorTextColor font-normal mobile:text-xs pc:text-[14px]">
                                    {errors?.password.message}
                                </p>
                            )}
                        </div>
                    </label>
                </div>
            )}

            <ChangeButtonInModal
                isLoading={isLoading}
                isValid={!isButtonDisabled}
                buttonBackgroundColor={buttonBackgroundColor}
                className={provider === "GOOGLE" ? "" : "mt-8"}
            />
        </form>
    );
};

export default EmailChangeModal;
