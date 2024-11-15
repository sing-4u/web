import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { useToast } from "../hooks/useToast";
import { useEffect, useState } from "react";
import getInputErrorClassName from "../utils/className";
import { ToastContainer } from "../components/ToastContainer";
import Navbar from "../components/Navbar";

interface FormValue {
    email: string;
    code: string;
}

const MAX_LENGTH = 6;

const FindPassword = () => {
    const navigate = useNavigate();
    const { showToast, toasts } = useToast();
    const [isAuthenticationCodeRequested, setIsAuthenticationCodeRequested] =
        useState(false);
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, dirtyFields }
    } = useForm<FormValue>();

    const isEmailValid = dirtyFields.email && !errors.email;

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
        const email = watch("email");
        if (timeLeft === 0) return;
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
            if (error instanceof Error) throw new Error(error.message);
        }
    };

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
                showToast("error", "인증 번호가 일치하지 않습니다.");
            }
        }
    };

    return (
        <div className="w-full max-w-[376px] mx-auto">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-md mx-auto p-6"
            >
                <Navbar />
                <div className="text-2xl font-bold text-center mt-[22px]">
                    비밀번호 찾기
                </div>

                <div className="relative flex flex-col mt-[60px]">
                    <label htmlFor="email" className="text-left mb-2">
                        이메일
                    </label>
                    <input
                        id="email"
                        {...register("email", {
                            required: "이메일은 필수입니다",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "올바른 이메일 주소를 입력해주세요"
                            }
                        })}
                        placeholder="가입한 이메일 주소"
                        className={`mb-[22px] ${getInputErrorClassName(
                            errors.email
                        )}`}
                    />
                    {errors.email && (
                        <span className="text-red-500 text-sm">
                            {errors.email.message}
                        </span>
                    )}
                    <button
                        type="button"
                        disabled={!isEmailValid}
                        className={`absolute inset-y-11 end-3 cursor-pointer text-sm rounded-[4px] px-2 py-2 h-[30px] flex flex-col justify-center
                            ${
                                isEmailValid
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
                        className={getInputErrorClassName(errors.code)}
                    />
                    {errors.code && (
                        <span className="text-red-500 text-sm">
                            {errors.code.message ||
                                "인증번호가 일치하지 않습니다."}
                        </span>
                    )}
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
            <ToastContainer toasts={toasts} />
        </div>
    );
};

export default FindPassword;
