import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { useToast } from "../hooks/useToast";
import { useEffect, useState } from "react";
import getInputErrorClassName from "../utils/className";
import { ToastContainer } from "../components/ToastContainer";
import Navbar from "../components/Navbar";
import { useModal } from "../hooks/useModal";
import SNSModalContent from "../components/Modal/SNSModal";
import { ModalType } from "../types";
import { useTitle } from "../utils/useTitle";
import ErrorMessage from "../components/ErrorMessage";

interface FormValue {
    email: string;
    code: string;
}

const MAX_LENGTH = 6;

const FindPassword = () => {
    const setTitle = useTitle();

    setTimeout(() => {
        setTitle("비밀번호 찾기");
    }, 100);

    const navigate = useNavigate();
    const { showToast, toasts } = useToast();
    const [isAuthenticationCodeRequested, setIsAuthenticationCodeRequested] =
        useState(false);
    const {
        register,
        handleSubmit,
        watch,
        setError,
        formState: { errors }
    } = useForm<FormValue>();

    const { openModal } = useModal();
    const email = watch("email");

    const MINUTES_IN_MS = 3 * 60 * 1000;
    const INTERVAL = 1000;
    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    const minutes = String(
        Math.floor(((timeLeft || 0) / (1000 * 60)) % 60)
    ).padStart(2, "0");
    const second = String(Math.floor(((timeLeft || 0) / 1000) % 60)).padStart(
        2,
        "0"
    );

    useEffect(() => {
        if (timeLeft === null || !isAuthenticationCodeRequested) return;

        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime === null) return null;
                if (prevTime <= 0) {
                    clearInterval(timer);
                    setIsAuthenticationCodeRequested(false);
                    return 0;
                }
                return prevTime - INTERVAL;
            });
        }, INTERVAL);

        return () => {
            clearInterval(timer);
        };
    }, [timeLeft, isAuthenticationCodeRequested]);

    const handleAuthenticationCodeClick = async () => {
        if (timeLeft === 0) return;
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if (!emailRegex.test(email)) {
            setError("email", {
                type: "manual",
                message: "이메일 형식에 맞지 않습니다."
            });
            return;
        }
        if (isEmailFromGoogleDomain(email)) {
            openModal({
                title: "SNS로 간편 가입된 계정입니다.",
                Content: SNSModalContent,
                type: ModalType.ERROR,
                buttonBackgroundColor: "bg-#7846dd"
            });
            return;
        }

        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/auth/get-email-code`,
                {
                    email
                }
            );

            showToast("success", "인증 번호가 전송되었습니다.");
            setIsAuthenticationCodeRequested(true);
            setTimeLeft(MINUTES_IN_MS);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                setError("email", {
                    type: "manual",
                    message:
                        "가입된 계정이 없습니다. 이메일을 다시 확인해주세요."
                });
            }
        }
    };

    const handleEmailKeyPress = async (
        event: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (event.key === "Enter") {
            event.preventDefault();
        }
        return;
    };

    const isEmailFromGoogleDomain = (email: string): boolean =>
        ["gmail.com", "googlemail.com"].includes(
            email.split("@")[1].toLowerCase()
        );

    const onSubmit = async ({ email, code }: FormValue) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/auth/verify-email-code`,
                { email, code }
            );

            const { data: accessToken } = res;
            navigate("/new-password", { state: accessToken });
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                setError("code", {
                    type: "manual",
                    message: "인증 번호가 일치하지 않습니다."
                });
            }
        }
    };

    return (
        <div className="w-full max-w-[376px] mx-auto relative">
            <ToastContainer toasts={toasts} />
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-md mx-auto p-6"
            >
                <Navbar />
                <div className="text-2xl font-bold text-center mt-[22px] mb-[60px]">
                    비밀번호 찾기
                </div>

                <div className="relative flex flex-col mt-[60px]">
                    <label htmlFor="email" className="text-left mb-2">
                        이메일
                    </label>
                    <input
                        id="email"
                        {...register("email", {
                            required: "이메일은 필수입니다"
                        })}
                        onKeyDown={handleEmailKeyPress}
                        placeholder="가입한 이메일 주소"
                        className={`${
                            errors.email ? `mb-2` : `mb-[22px]`
                        } ${getInputErrorClassName(errors.email)}`}
                    />
                    {errors.email && (
                        <span className="text-red-500 text-sm mb-[22px]">
                            {errors.email.message}
                        </span>
                    )}
                    <button
                        type="button"
                        disabled={!email}
                        className={`absolute inset-y-11 end-3 text-sm rounded-[4px] px-2 py-2 h-[30px] flex flex-col justify-center
                            ${
                                email !== ""
                                    ? "bg-black text-textColor hover:text-gray-400"
                                    : "bg-customGray text-textColor"
                            }`}
                        onClick={handleAuthenticationCodeClick}
                    >
                        <span
                            className="

                            rounded-[4px] flex flex-col justify-center disabled:text-textColor hover:text-gray-400"
                        >
                            {isAuthenticationCodeRequested
                                ? "재요청"
                                : "인증번호 요청"}
                        </span>
                    </button>
                </div>
                <div className="relative flex flex-col">
                    <label htmlFor="code" className="text-left mb-2">
                        인증번호
                    </label>
                    <input
                        id="code"
                        type="text"
                        {...register("code", {
                            required: "인증번호는 필수입니다",
                            maxLength: {
                                value: MAX_LENGTH,
                                message: `인증번호는 ${MAX_LENGTH}자리로 입력해주세요.`
                            }
                        })}
                        placeholder="인증번호 6자리 입력"
                        className={`mb-2 ${getInputErrorClassName(
                            errors.code
                        )}`}
                    />

                    <ErrorMessage
                        field="code"
                        errors={errors || "인증번호가 일치하지 않습니다."}
                    />
                    {timeLeft !== 0 && (
                        <span className="absolute inset-y-12 end-3 text-red-500">
                            {minutes}:{second}
                        </span>
                    )}
                </div>
                <button
                    className="w-full bg-colorPurple text-textColor rounded-[10px] h-[52px] mt-10"
                    type="submit"
                >
                    다음
                </button>
            </form>
        </div>
    );
};

export default FindPassword;
