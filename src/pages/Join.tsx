import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Checkbox from "../components/Checkbox";
import axios from "axios";
import CheckboxOutline from "../../src/assets/_checkbox_outline.svg";
import CheckboxBlack from "../../src/assets/_checkbox.svg";
import { useLocation, useNavigate } from "react-router-dom";
import getInputErrorClassName from "../utils/className";
import GoogleIcon from "../components/GoogleIcon";
import usePasswordToggle from "../hooks/usePasswordToggle";
import storeToken from "../utils/storeToken";
import { useToast } from "../hooks/useToast";
import { useAuthRedirect } from "../hooks/useAuthRedirect";
import ErrorMessage from "../components/ErrorMessage";
import Logo from "../assets/logo.svg";
import { ToastContainer } from "../components/ToastContainer";
import { useTitle } from "../utils/useTitle";
import Tooltip from "../assets/tootip.svg";

interface FormValues {
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
}

interface CheckboxState {
    age: boolean;
    terms: boolean;
    privacy: boolean;
}

const Join = () => {
    const setTitle = useTitle();

    setTimeout(() => {
        setTitle("회원가입");
    }, 100);

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const { isAuthenticated } = useAuthRedirect("/");
    const { showToast, toasts } = useToast();

    const [checkboxes, setCheckboxes] = useState<CheckboxState>({
        age: false,
        terms: false,
        privacy: false
    });

    const [termsError, setTermsError] = useState("");

    const {
        register,
        handleSubmit,
        watch,
        setError,
        formState: { errors }
    } = useForm<FormValues>();

    const watchPassword = watch("password");

    const {
        passwordState: password,
        handleToggle,
        handleEyeIconToggle
    } = usePasswordToggle();

    const {
        passwordState: confirmPassword,
        handleToggle: handleConfirmToggle,
        handleEyeIconToggle: handleConfirmEyeIconToggle
    } = usePasswordToggle();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const providerCode = urlParams.get("code");
        if (providerCode) {
            const processGoogleLogin = async () => {
                try {
                    const response = await axios.post(
                        `${import.meta.env.VITE_API_URL}/auth/login/social`,
                        {
                            provider: "GOOGLE",
                            providerCode
                        }
                    );
                    const { accessToken, refreshToken } = response.data;
                    storeToken(accessToken, refreshToken);
                    navigate(from, { replace: true });
                } catch (error) {
                    if (error) {
                        showToast("error", "Google 로그인에 실패했습니다.");
                    }
                }
            };
            processGoogleLogin();
        }
    }, [navigate, from, showToast]);

    if (isAuthenticated) {
        return null;
    }

    const isAllChecked = Object.values(checkboxes).every((box) => box);

    const handleCheckboxToggle = (name: keyof CheckboxState) => {
        setCheckboxes((prev) => ({ ...prev, [name]: !prev[name] }));
        setTermsError("");
    };

    const handleGoogleClick = async () => {
        const oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";
        const params = new URLSearchParams({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URI,
            response_type: "code",
            scope: [
                "https://www.googleapis.com/auth/userinfo.profile",
                "https://www.googleapis.com/auth/userinfo.email"
            ].join(" "),
            include_granted_scopes: "true"
        });
        window.location.href = `${oauth2Endpoint}?${params.toString()}`;
    };

    const handleAllCheckboxes = () => {
        const allChecked = Object.values(checkboxes).every((v) => v);
        setCheckboxes({
            age: !allChecked,
            terms: !allChecked,
            privacy: !allChecked
        });
        setTermsError("");
    };

    const checkboxLabels = {
        age: "[필수] 만 14세 이상입니다",
        terms: "[필수] 이용약관에 동의합니다",
        privacy: "[필수] 개인정보 처리방침에 동의합니다"
    };

    const validateTerms = (): boolean => {
        if (!checkboxes.age || !checkboxes.terms || !checkboxes.privacy) {
            setTermsError("필수 이용약관에 동의해주세요");
            return false;
        }
        setTermsError("");
        return true;
    };

    const onSubmit = async ({ email, password, name }: FormValues) => {
        if (!validateTerms()) {
            return;
        }

        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/auth/register/email`,
                { email, password, name }
            );

            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/auth/login/email`,
                { email, password }
            );
            const { accessToken, refreshToken } = res.data;
            storeToken(accessToken, refreshToken);
            showToast("success", "회원가입이 완료되었습니다.");
            setTimeout(() => {
                navigate("/");
            }, 1000);
        } catch (e) {
            if (axios.isAxiosError(e) && e.response) {
                if (e.response.status === 409) {
                    // return;
                    setError("email", {
                        type: "manual",
                        message: "이미 존재하는 이메일입니다."
                    });
                }
            }
            if (e instanceof Error) throw new Error(e.message);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto w-[380px]">
            <ToastContainer toasts={toasts} />
            <div className="">
                <img src={Logo} alt="logo" className="w-16 h-16 mb-2" />
                <div className="text-2xl font-bold text-center mb-[67px]">
                    회원가입
                </div>

                <div>
                    <div className="relative group w-full h-[48px] rounded-[10px] border border-black mb-10">
                        <button
                            type="button"
                            onClick={handleGoogleClick}
                            className="w-full h-full flex items-center justify-center font-bold text-sm"
                        >
                            <GoogleIcon />
                            <span className="ml-2">Google로 회원가입</span>
                        </button>
                        <img
                            src={Tooltip}
                            alt="Google Sign Up"
                            className="w-[90px] h-auto absolute hidden group-hover:block -top-2 left-1/2 -translate-x-1/2 -translate-y-full z-50 transition-all duration-300 animate-fadeIn"
                        />
                    </div>
                    <div className="flex items-center my-10">
                        <span className="w-full border-b"></span>
                    </div>

                    <div className="space-y-4">
                        <div className="flex flex-col">
                            <label className="text-sm flex flex-col font-bold">
                                닉네임
                                <input
                                    type="text"
                                    {...register("name", {
                                        required: "닉네임을 입력해주세요.",
                                        maxLength: {
                                            value: 50,
                                            message:
                                                "최대 50자까지 입력 가능합니다."
                                        }
                                    })}
                                    className={`border border-[#e1e1e1] mt-2 placeholder:font-normal font-normal ${getInputErrorClassName(
                                        errors.name
                                    )}`}
                                    placeholder="별명"
                                />
                            </label>
                            {errors.name && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>
                        <div className="pc:my-[30px]"></div>

                        <div className="flex flex-col">
                            <label className="text-sm flex flex-col font-bold">
                                이메일
                                <input
                                    type="email"
                                    {...register("email", {
                                        required: "이메일을 입력해주세요",
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message:
                                                "올바른 이메일 형식이 아닙니다."
                                        }
                                    })}
                                    className={`border border-[#e1e1e1] h-[48px] px-4 text-sm mt-2 placeholder:font-normal font-normal ${getInputErrorClassName(
                                        errors.email
                                    )}`}
                                    placeholder="abc@email.com"
                                />
                            </label>

                            <ErrorMessage field="email" errors={errors} />
                        </div>
                        <div className="pc:my-[30px]"></div>
                        <div className="flex flex-col">
                            <label className="text-sm mb-2 font-bold">
                                비밀번호
                                <div className="relative top-2">
                                    <input
                                        type={password.type}
                                        {...register("password", {
                                            required: "비밀번호를 입력해주세요",
                                            pattern: {
                                                value: /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/,
                                                message:
                                                    "영문, 숫자를 포함한 8자 이상의 비밀번호"
                                            }
                                        })}
                                        className={`border border-[#e1e1e1] w-full h-[48px] px-4 text-sm pr-12 placeholder:font-normal font-normal ${getInputErrorClassName(
                                            errors.password
                                        )}`}
                                        placeholder="영문, 숫자를 포함한 8자 이상의 비밀번호"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleToggle}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2"
                                    >
                                        <img
                                            src={handleEyeIconToggle()}
                                            alt="Toggle Password Visibility"
                                            className="w-5 h-5"
                                        />
                                    </button>
                                </div>
                            </label>

                            <ErrorMessage field="password" errors={errors} />
                        </div>
                        <div className="pc:my-[30px]"></div>
                        <div className="flex flex-col">
                            <label className="text-sm font-bold">
                                비밀번호 확인
                                <div className="relative top-2">
                                    <input
                                        type={confirmPassword.type}
                                        {...register("confirmPassword", {
                                            required:
                                                "비밀번호 확인을 해주세요",
                                            validate: (value) =>
                                                value === watchPassword ||
                                                "비밀번호가 일치하지 않습니다."
                                        })}
                                        className={`border border-[#e1e1e1] w-full h-[48px] px-4 text-sm pr-12 placeholder:font-normal font-normal ${getInputErrorClassName(
                                            errors.confirmPassword
                                        )}`}
                                        placeholder="비밀번호 확인"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleConfirmToggle}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2"
                                    >
                                        <img
                                            src={handleConfirmEyeIconToggle()}
                                            alt="Toggle Password Visibility"
                                            className="w-5 h-5"
                                        />
                                    </button>
                                </div>
                            </label>

                            <ErrorMessage
                                field="confirmPassword"
                                errors={errors}
                            />
                        </div>
                        <div className="pc:my-[30px]"></div>
                    </div>

                    <div className="space-y-4 mt-[30px]">
                        <div className="text-sm font-bold">약관동의</div>
                        <div
                            className="flex items-center space-x-2 cursor-pointer"
                            onClick={handleAllCheckboxes}
                        >
                            <img
                                src={
                                    isAllChecked
                                        ? CheckboxBlack
                                        : CheckboxOutline
                                }
                                alt=""
                                className="w-5 h-5"
                            />
                            <span className="text-sm font-bold">전체동의</span>
                        </div>
                        <div className="w-full border-t border-gray-200 my-4"></div>
                        <div className="space-y-4">
                            {Object.entries(checkboxLabels).map(
                                ([key, label]) => (
                                    <Checkbox
                                        key={key}
                                        label={label}
                                        isChecked={
                                            checkboxes[
                                                key as keyof CheckboxState
                                            ]
                                        }
                                        type={
                                            key as "age" | "terms" | "privacy"
                                        }
                                        onToggle={() =>
                                            handleCheckboxToggle(
                                                key as keyof CheckboxState
                                            )
                                        }
                                    />
                                )
                            )}
                        </div>
                        {termsError && (
                            <p className="text-red-500 text-xs">{termsError}</p>
                        )}
                    </div>

                    <button
                        className="w-full bg-colorPurple text-white rounded-lg h-[48px] text-sm mt-8"
                        type="submit"
                    >
                        회원가입
                    </button>
                </div>
            </div>
        </form>
    );
};

export default Join;
