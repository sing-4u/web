import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "../components/ToastContainer";
import { useToast } from "../hooks/useToast";
import { useState } from "react";

interface FormValue {
    email: string;
    code: string;
}

const FindPassword = () => {
    const navigate = useNavigate();
    const { showToast, toasts } = useToast();
    const [isAuthenticationCodeRequested, setIsAuthenticationCodeRequested] =
        useState(false);
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<FormValue>();

    const handleAuthenticationCodeClick = async () => {
        const email = watch("email");

        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/auth/get-email-code`,
                {
                    email
                }
            );
            showToast("success", "인증 번호가 전송되었습니다.");
            setIsAuthenticationCodeRequested(true);
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
        <>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-md mx-auto p-6 space-y-4"
            >
                <div className="flex">로고</div>
                <div className="text-2xl font-bold text-center">
                    비밀번호 찾기
                </div>

                <div className="relative flex flex-col">
                    <label
                        htmlFor="email"
                        className="text-left font-Pretendard mb-2"
                    >
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
                        className="border rounded-[10px] py-[14px] px-[18px] placeholder:font-Pretendard placeholder:text-inputTextColor"
                    />
                    {errors.email && (
                        <span className="text-red-500 text-sm">
                            {errors.email.message}
                        </span>
                    )}
                    <button
                        type="button"
                        className="absolute inset-y-12 end-3 cursor-pointer text-sm "
                        onClick={handleAuthenticationCodeClick}
                    >
                        <span className="text-inputTextColor hover:text-gray-400">
                            {isAuthenticationCodeRequested
                                ? "재요청"
                                : "인증번호 요청"}
                        </span>
                    </button>
                </div>
                <div className="relative flex flex-col">
                    <label
                        htmlFor="code"
                        className="text-left font-Pretendard mb-2"
                    >
                        인증번호
                    </label>
                    <input
                        id="code"
                        type="text"
                        {...register("code", {
                            required: "인증번호는 필수입니다"
                        })}
                        placeholder="인증번호"
                        className="border rounded-[10px] py-[14px] px-[18px] placeholder:font-Pretendard placeholder:text-inputTextColor"
                    />
                    {errors.code && (
                        <span className="text-red-500 text-sm">
                            {errors.code.message ||
                                "인증번호가 일치하지 않습니다."}
                        </span>
                    )}
                </div>
                <button
                    className="w-full bg-buttonBackgroundColor text-white rounded-[10px] h-[52px] font-Pretendard"
                    type="submit"
                >
                    다음
                </button>
            </form>
            <ToastContainer toasts={toasts} />
        </>
    );
};

export default FindPassword;
