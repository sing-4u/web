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
import { DecodedToken } from "./Join";
import { jwtDecode } from "jwt-decode";
import Logo from "../components/Logo";

interface FormValue {
    email: string;
    code: string;
}

interface AuthState {
    isAuthenticationCodeRequested: boolean;
    lastRequestTime: number;
    isRequesting: boolean;
    timeLeft: number | null;
    showTimer: boolean;
}

const MAX_LENGTH = 6;

const FindPassword = () => {
    const setTitle = useTitle();

    setTimeout(() => {
        setTitle("비밀번호 찾기");
    }, 100);

    const navigate = useNavigate();
    const { showToast, toasts } = useToast();

    const [authState, setAuthState] = useState<AuthState>({
        isAuthenticationCodeRequested: false,
        lastRequestTime: 0,
        isRequesting: false,
        showTimer: false,
        timeLeft: null
    });

    const {
        register,
        handleSubmit,
        watch,
        setError,
        formState: { errors },
        clearErrors
    } = useForm<FormValue>({ mode: "onChange" });

    const { openModal } = useModal();
    const email = watch("email");

    const MINUTES_IN_MS = 3 * 60 * 1000;
    const INTERVAL = 1000;
    const COOLDOWN_DURATION = 30000;

    const minutes = String(
        Math.floor(((authState.timeLeft || 0) / (1000 * 60)) % 60)
    ).padStart(2, "0");
    const second = String(
        Math.floor(((authState.timeLeft || 0) / 1000) % 60)
    ).padStart(2, "0");

    useEffect(() => {
        if (
            authState.timeLeft === null ||
            !authState.isAuthenticationCodeRequested
        )
            return;

        const timer = setInterval(() => {
            setAuthState((prev) => ({
                ...prev,
                timeLeft:
                    prev.timeLeft !== null && prev.timeLeft > 0
                        ? prev.timeLeft - INTERVAL
                        : 0,
                isAuthenticationCodeRequested:
                    prev.timeLeft !== null && prev.timeLeft > 0
            }));
        }, INTERVAL);

        return () => {
            clearInterval(timer);
        };
    }, [authState.timeLeft, authState.isAuthenticationCodeRequested]);

    const checkRegexEmail = (email: string) => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if (!emailRegex.test(email)) {
            setError("email", {
                type: "manual",
                message: "이메일 형식에 맞지 않습니다."
            });
            return;
        }
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
            return;
        }
    };

    const handleAuthenticationCodeClick = async () => {
        try {
            checkRegexEmail(email);
            if (errors.email) return;
            retryRequestAuthenticationNumber(authState.lastRequestTime);

            await axios.post(`${baseURL}/auth/get-email-code`, { email });

            setAuthState((prev) => ({
                ...prev,
                isAuthenticationCodeRequested: true,
                timeLeft: MINUTES_IN_MS,
                lastRequestTime: Date.now(),
                showTimer: true
            }));

            showToast("success", "인증번호가 전송되었습니다.");
            clearErrors("email");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 404) {
                    setError("email", {
                        type: "manual",
                        message:
                            "가입된 계정이 없습니다. 이메일을 다시 확인해주세요."
                    });
                } else if (error.response?.status === 403) {
                    openModal({
                        title: "SNS로 간편 가입된 계정입니다.",
                        Content: SNSModalContent,
                        type: ModalType.ERROR,
                        buttonBackgroundColor: "bg-[#7846dd]",
                        showErrorIcon: false
                    });
                }
            }
            setAuthState((prev) => ({
                ...prev,
                showTimer: false
            }));
        } finally {
            setAuthState((prev) => ({
                ...prev,
                isRequesting: false
            }));
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

    const onSubmit = async ({ email, code }: FormValue) => {
        try {
            const res = await axios.post(`${baseURL}/auth/verify-email-code`, {
                email,
                code
            });

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

    const buttonText = authState.isRequesting
        ? "요청 중..."
        : authState.isAuthenticationCodeRequested
        ? "재요청"
        : "인증번호 요청";

    return (
        <div className="w-full max-w-[376px] mx-auto relative">
            <ToastContainer toasts={toasts} />

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-md mx-auto p-6"
            >
                <div
                    onClick={() => navigate("/")}
                    className="w-[64px] h-[22.5px] cursor-pointer"
                >
                    <Logo />
                </div>
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
                        <span className="text-errorTextColor text-sm mb-[22px]">
                            {errors.email.message}
                        </span>
                    )}
                    <button
                        type="button"
                        disabled={!email || authState.isRequesting}
                        className={`absolute inset-y-11 end-3 text-sm rounded-[4px] px-2 py-2 h-[30px] flex flex-col justify-center
                            ${
                                email !== ""
                                    ? "bg-black text-textColor hover:text-gray-400"
                                    : "bg-customGray text-textColor"
                            }`}
                        onClick={handleAuthenticationCodeClick}
                    >
                        <span className="flex flex-col justify-center disabled:text-textColor hover:text-gray-400">
                            {buttonText}
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

                    {errors.code && (
                        <p className="mt-1 text-sm text-errorTextColor">
                            {errors.code.message}
                        </p>
                    )}
                    {authState.timeLeft !== 0 && authState.showTimer && (
                        <span className="absolute inset-y-12 end-3 text-red-500">
                            {minutes}:{second}
                        </span>
                    )}
                </div>
                <button
                    className="w-full bg-colorPurple text-textColor rounded-lg h-[52px] mt-10 hover:bg-colorPurpleHover"
                    type="submit"
                >
                    다음
                </button>
            </form>
        </div>
    );
};

export default FindPassword;
