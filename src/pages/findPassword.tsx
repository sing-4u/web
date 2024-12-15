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
import { useTitle } from "../hooks/useTitle";
import { baseURL } from "../utils/apiUrl";
import Logo from "../components/Logo";
import NavbarWithoutLoginButton from "../components/NavBarWithoutLoginButton";

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
    const [lastRequestTime, setLastRequestTime] = useState(0);
    const [isRequesting, setIsRequesting] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setError,
        formState: { errors },
        clearErrors
    } = useForm<FormValue>({ mode: "onChange" });
    const [showTimer, setShowTimer] = useState(false);

    const { openModal } = useModal();
    const email = watch("email");

    const MINUTES_IN_MS = 3 * 60 * 1000;
    const INTERVAL = 1000;
    const COOLDOWN_DURATION = 30000;
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
                    clearErrors("code");
                    return 0;
                }
                return prevTime - INTERVAL;
            });
        }, INTERVAL);

        return () => {
            clearInterval(timer);
        };
    }, [timeLeft, isAuthenticationCodeRequested, clearErrors]);

    const checkRegexEmail = (email: string) => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if (!emailRegex.test(email)) {
            setError("email", {
                type: "manual",
                message: "올바른 이메일 형식이 아닙니다."
            });
            return false;
        }
        clearErrors("email");
        return true;
    };

    const retryRequestAuthenticationNumber = (time: number) => {
        if (time && Date.now() - time < COOLDOWN_DURATION) {
            openModal({
                title: "잠시 후 다시 시도해주세요.",
                Content: () => (
                    <div className="flex flex-col gap-y-4 rounded-[10px]"></div>
                ),
                type: ModalType.ERROR,
                buttonBackgroundColor: "bg-[#7846dd]",
                showErrorIcon: false
            });
            return true;
        }
        return false;
    };

    // 이메일 존재 여부 판단
    const handleNoAccountError = (error: Error) => {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            setError("email", {
                type: "manual",
                message: "가입된 계정이 없습니다. 이메일을 다시 확인해주세요."
            });
        }
    };

    // 소셜로 가입한 경우
    const handleSocialAccountError = (error: Error) => {
        if (axios.isAxiosError(error) && error.response?.status === 403) {
            openModal({
                title: "SNS로 간편 가입된 계정입니다.",
                Content: SNSModalContent,
                type: ModalType.ERROR,
                buttonBackgroundColor: "bg-[#7846dd]",
                showErrorIcon: false
            });
            return;
        }
    };

    const handleAuthenticationCodeClick = async () => {
        if (retryRequestAuthenticationNumber(lastRequestTime)) {
            return;
        }

        // 이메일 유효성 검사
        if (!checkRegexEmail(email)) {
            return;
        }

        setIsRequesting(true);

        setLastRequestTime(Date.now());

        try {
            const response = await axios.post(
                `${baseURL}/auth/get-email-code`,
                { email }
            );
            if (response.status === 200) {
                showToast("success", "인증번호가 전송되었습니다.");
                setIsAuthenticationCodeRequested(true);
                setShowTimer(true);
                setTimeLeft(MINUTES_IN_MS);
            }
        } catch (error) {
            if (error instanceof Error) {
                handleNoAccountError(error);
                handleSocialAccountError(error);
            }
            setShowTimer(false);
        } finally {
            setIsRequesting(false);
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

    // 인증번호 검증
    const handleInvalidAuthCodeError = (error: Error) => {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            setError("code", {
                type: "manual",
                message: "인증번호가 올바르지 않습니다."
            });
        }
    };

    // 인증번호 입력 여부 판단
    const validateAuthCodeInput = (code: string) => {
        if (!code) {
            setError("code", {
                type: "required",
                message: "인증번호를 입력해주세요."
            });
            return false;
        }
        return true;
    };

    const onSubmit = async ({ email, code }: FormValue) => {
        if (timeLeft === 0) {
            clearErrors("code");
            return;
        }

        if (!validateAuthCodeInput(code)) return;

        try {
            const res = await axios.post(`${baseURL}/auth/verify-email-code`, {
                email,
                code
            });

            const { data: accessToken } = res;
            navigate("/new-password", { state: accessToken });
        } catch (error) {
            if (error instanceof Error) handleInvalidAuthCodeError(error);
        }
    };

    const buttonText = isRequesting
        ? "요청 중..."
        : isAuthenticationCodeRequested
        ? "재요청"
        : "인증번호 요청";

    const inputClass =
        "w-full h-[52px] rounded-[10px] border border-inputBorderColor py-3.5 px-[18px] focus:outline-none focus:border-[1px] focus:border-black placeholder:mobile:text-sm placeholder:mobile:font-normal placeholder:tablet:text-sm placeholder:mobile:font-normal placholder:pc:text-base";

    return (
        <div className="w-full relative">
            <NavbarWithoutLoginButton />
            <ToastContainer toasts={toasts} />

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-md mx-auto p-6"
            >
                <div className="text-2xl font-bold text-center mt-[22px] mb-[60px]">
                    비밀번호 찾기
                </div>

                <div className="relative flex flex-col mt-[60px]">
                    <label
                        htmlFor="email"
                        className="text-left mb-2 font-normal mobile:text-sm pc:text-base"
                    >
                        이메일
                    </label>
                    <input
                        id="email"
                        {...register("email", {
                            required: "이메일을 입력해주세요."
                        })}
                        onKeyDown={handleEmailKeyPress}
                        placeholder="가입한 이메일 주소"
                        className={`${inputClass} ${
                            errors.email
                                ? "mb-2 border-errorTextColor"
                                : "mb-[22px] border-customGray"
                        }`}
                    />
                    {errors.email && (
                        <span className="text-red-500 text-sm mb-[22px]">
                            {errors.email.message}
                        </span>
                    )}
                    <button
                        type="button"
                        disabled={!email || isRequesting}
                        className={`mobile:absolute mobile:inset-y-10 mobile:right-3 tablet:right-3 tablet:absolute tablet:inset-y-11 pc:right-2 pc:absolute pc:inset-y-11 flex items-center z-20 px-2 py-2 rounded-[4px] h-[30px] cursor-pointer rounded-e-md focus:outline-none disabled:text-textColor disabled:cursor-not-allowed ${
                            email !== ""
                                ? "bg-black text-textColor"
                                : "bg-customGray text-textColor"
                        }`}
                        onClick={handleAuthenticationCodeClick}
                    >
                        <span className="flex flex-col justify-center mobile:text-xs tablet:text-xs pc:text-sm">
                            {buttonText}
                        </span>
                    </button>
                </div>
                <div className="relative flex flex-col">
                    <label
                        htmlFor="code"
                        className="text-left mb-2 font-normal mobile:text-sm pc:text-base"
                    >
                        인증번호
                    </label>
                    <input
                        id="code"
                        type="text"
                        {...register("code", {
                            maxLength: {
                                value: MAX_LENGTH,
                                message: `인증번호는 ${MAX_LENGTH}자리로 입력해주세요.`
                            },
                            validate: (value) => {
                                if (value === "") {
                                    return "인증번호를 입력해주세요.";
                                }
                            }
                        })}
                        placeholder="인증번호 6자리 입력"
                        className={`${inputClass} ${
                            errors.code
                                ? "mb-2 border-errorTextColor"
                                : "mb-[22px] border-customGray"
                        }`}
                    />
                    {/* 유효시간이 만료되면 이 메시지는 사라짐 */}
                    {errors.code && timeLeft !== 0 && (
                        <p className="mt-1 text-sm text-errorTextColor">
                            {errors.code.message}
                        </p>
                    )}
                    {/* 유효시간이 만료되면 이 메시지로 교체됨 */}
                    {timeLeft === 0 && (
                        <p className="mt-1 text-sm text-errorTextColor">
                            유효시간이 만료되었습니다. 재발송 후 다시 시도해
                            주세요.
                        </p>
                    )}
                    {timeLeft !== 0 && showTimer && (
                        <span className="mobile:absolute mobile:top-[46px] mobile:end-3 tablet:absolute tablet:top-[48px] tablet:end-3 pc:absolute pc:top-[46px] pc:end-3 text-errorTextColor mobile:text-sm">
                            {minutes}:{second}
                        </span>
                    )}
                </div>
                <button
                    className={`w-full ${
                        !isAuthenticationCodeRequested
                            ? "bg-buttonColor2 text-customGray cursor-not-allowed"
                            : "text-white bg-colorPurple"
                    } text-textColor rounded-lg h-[52px] mt-10 font-bold mobile:text-sm pc:text-lg`}
                    type="submit"
                >
                    다음
                </button>
            </form>
        </div>
    );
};

export default FindPassword;
