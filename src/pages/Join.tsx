import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Checkbox from "../components/Checkbox";
import axios from "axios";
import CheckboxOutline from "../../src/assets/_checkbox_outline.svg";
import CheckboxBlack from "../../src/assets/_checkbox.svg";
import { useLocation, useNavigate } from "react-router-dom";
import GoogleIcon from "../components/GoogleIcon";
import usePasswordToggle from "../hooks/usePasswordToggle";
import storeToken from "../utils/storeToken";
import { useToast } from "../hooks/useToast";
import { useAuthRedirect } from "../hooks/useAuthRedirect";
import { ToastContainer } from "../components/ToastContainer";
import { useTitle } from "../hooks/useTitle";
import Tooltip from "../assets/tootip.svg";
import { baseURL } from "../utils/apiUrl";
import { jwtDecode } from "jwt-decode";
import NavbarWithoutLoginButton from "../components/NavBarWithoutLoginButton";

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

export interface DecodedToken {
    email: string;
    provider: string;
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
        const saveAccessToken = async () => {
            const hash = window.location.hash;
            const params = new URLSearchParams(hash.substring(1));
            const accessToken = params.get("access_token");

            if (accessToken) {
                localStorage.setItem("providerAccessToken", accessToken);
                return accessToken;
            }
            return null;
        };

        const processGoogleLogin = async () => {
            try {
                const providerAccessToken = await saveAccessToken();

                if (providerAccessToken) {
                    const response = await axios.post(
                        `${baseURL}/auth/login/social`,
                        {
                            provider: "GOOGLE",
                            providerAccessToken
                        }
                    );

                    const { accessToken, refreshToken } = response.data;
                    const decodedToken = jwtDecode<DecodedToken>(accessToken);

                    localStorage.setItem(
                        "userInfo",
                        JSON.stringify({
                            email: decodedToken.email,
                            provider: decodedToken.provider
                        })
                    );

                    storeToken(accessToken, refreshToken);
                    navigate(from, { replace: true });
                }
            } catch (error) {
                console.error("Google 로그인 처리 중 오류 발생:", error);
            }
        };

        if (window.location.hash) {
            processGoogleLogin();
        }
    }, [navigate, from, showToast]);

    if (isAuthenticated) {
        return null;
    }

    const isButtonDisabled = Object.values(watch()).some((value) => !value);

    const isAllChecked = Object.values(checkboxes).every((box) => box);

    const handleCheckboxToggle = (name: keyof CheckboxState) => {
        setCheckboxes((prev) => ({ ...prev, [name]: !prev[name] }));
        setTermsError("");
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
            await axios.post(`${baseURL}/auth/register/email`, {
                email,
                password,
                name
            });

            const res = await axios.post(`${baseURL}/auth/login/email`, {
                email,
                password
            });
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
        <>
            <NavbarWithoutLoginButton />
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="mx-auto w-[380px] p-6"
            >
                <ToastContainer toasts={toasts} />

                <div className="text-2xl font-bold text-center mt-[22px] mb-[60px]">
                    회원가입
                </div>

                <div>
                    <div className="relative group w-full h-[48px] rounded-[10px] border border-black mb-10">
                        <a
                            href={`https://accounts.google.com/o/oauth2/auth?client_id=${
                                import.meta.env.VITE_GOOGLE_CLIENT_ID
                            }&redirect_uri=${
                                import.meta.env.VITE_GOOGLE_REDIRECT_URI
                            }&response_type=token&scope=https://www.googleapis.com/auth/userinfo.email`}
                            className="w-full h-full flex items-center justify-center font-bold text-sm"
                        >
                            <GoogleIcon />
                            <span className="ml-2">Google로 회원가입</span>
                        </a>
                        <img
                            src={Tooltip}
                            alt="Google Sign Up"
                            className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full z-50 transition-all duration-300 animate-fadeIn"
                        />
                    </div>
                    <div className="flex items-center my-10">
                        <span className="w-full border-b border-[#f3f3f3]"></span>
                    </div>

                    <div className="space-y-4">
                        <div className="flex flex-col">
                            <label className="text-sm flex flex-col">
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
                                    className={`w-full h-[52px] border border-inputBorderColor text-[#AAAAA] ${
                                        errors.name
                                            ? "border-errorTextColor"
                                            : "border-customGray"
                                    }
                  rounded-lg text-left placeholder:text-[14px] placeholder:leading-[24px]
                  placeholder:pt-[14px] pl-[18px] text-[16px] mt-2`}
                                    placeholder="별명"
                                />
                            </label>
                            {errors.name && (
                                <p className="text-errorTextColor text-sm mt-2">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm flex flex-col">
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
                                    className={`w-full h-[52px] border border-inputBorderColor text-[#AAAAA] ${
                                        errors.email
                                            ? "border-errorTextColor"
                                            : "border-customGray"
                                    }
                  rounded-[10px] text-left placeholder:text-[14px] placeholder:leading-[24px]
                  placeholder:pt-[14px] pl-[18px] text-[16px] mt-2`}
                                    placeholder="abc@email.com"
                                />
                            </label>

                            {errors.email && (
                                <p className="text-errorTextColor text-sm mt-2">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="password" className="text-sm">
                                비밀번호
                                <div className="relative top-2">
                                    <input
                                        type={password.type}
                                        id="password"
                                        {...register("password", {
                                            required:
                                                "비밀번호를 입력해주세요.",
                                            pattern: {
                                                value: /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/,
                                                message:
                                                    "8~16자의 영문 대/소문자, 숫자, 특수문자를 조합하여 입력해주세요."
                                            }
                                        })}
                                        className={`w-full h-[52px] border border-inputBorderColor text-[#AAAAA] ${
                                            errors.password
                                                ? "border-errorTextColor"
                                                : "border-customGray"
                                        }
                  rounded-lg text-left placeholder:text-[14px] placeholder:leading-[24px]
                  placeholder:pt-[14px] pl-[18px] text-[16px]`}
                                        placeholder="영문, 숫자를 포함한 8자 이상의 비밀번호"
                                    />

                                    <img
                                        src={handleEyeIconToggle()}
                                        alt="Toggle Password Visibility"
                                        className="w-5 h-5 absolute right-4 top-1/2 transform -translate-y-1/2"
                                        onClick={handleToggle}
                                        tabIndex={-1}
                                    />
                                </div>
                            </label>

                            {errors.password && (
                                <p className="text-errorTextColor text-sm mt-4">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <label
                                htmlFor="confirmPassword"
                                className="text-sm mt-2"
                            >
                                비밀번호 확인
                                <div className="relative top-2">
                                    <input
                                        type={confirmPassword.type}
                                        id="confirmPassword"
                                        {...register("confirmPassword", {
                                            required:
                                                "비밀번호를 입력해주세요.",
                                            validate: (value) =>
                                                value === watchPassword ||
                                                "비밀번호가 일치하지 않습니다."
                                        })}
                                        className={`w-full h-[52px] border border-inputBorderColor text-[#AAAAA] ${
                                            errors.password
                                                ? "border-errorTextColor"
                                                : "border-customGray"
                                        }
                  rounded-lg text-left placeholder:text-[14px] placeholder:leading-[24px]
                  placeholder:pt-[14px] pl-[18px] text-[16px]`}
                                        placeholder="비밀번호 확인"
                                    />

                                    <img
                                        src={handleConfirmEyeIconToggle()}
                                        alt="Toggle Password Visibility"
                                        className="w-5 h-5 absolute right-4 top-1/2 transform -translate-y-1/2"
                                        onClick={handleConfirmToggle}
                                    />
                                </div>
                            </label>

                            {errors.confirmPassword && (
                                <p className="text-errorTextColor text-sm mt-4">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4 mt-[30px]">
                        <div className="text-sm font-bold">약관동의</div>
                        <div
                            className="flex items-center space-x-2 cursor-pointer"
                            role="checkbox"
                            tabIndex={0}
                            aria-checked={isAllChecked}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    handleAllCheckboxes();
                                }
                            }}
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
                            <p className="text-errorTextColor text-xs">
                                {termsError}
                            </p>
                        )}
                    </div>

                    <button
                        disabled={isButtonDisabled}
                        className="w-full bg-colorPurple disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg h-14 text-sm mt-8 hover:bg-colorPurpleHover"
                        type="submit"
                    >
                        회원가입
                    </button>
                </div>
            </form>
        </>
    );
};

export default Join;
