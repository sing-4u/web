import { useState } from "react";
import { useForm } from "react-hook-form";
import Checkbox from "../components/Checkbox";
import GoogleBtn from "../../src/assets/btn.png";
import axios from "axios";
import CheckboxOutline from "../../src/assets/_checkbox.png";
import CheckboxBlack from "../../src/assets/_checkbox_black.png";
import { useNavigate } from "react-router-dom";

import getInputErrorClassName from "../utils/className";
import usePasswordToggle from "../hooks/usePasswordToggle";

interface FormValues {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface CheckboxState {
    age: boolean;
    terms: boolean;
    privacy: boolean;
}

const Join = () => {
    const navigate = useNavigate();
    const defaultValues = {
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
        }
    };
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
        watch
    } = useForm<FormValues>(defaultValues);

    const [checkboxes, setCheckboxes] = useState<CheckboxState>({
        age: false,
        terms: false,
        privacy: false
    });

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

    const [termsError, setTermsError] = useState("");

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

        const queryParams = new URLSearchParams(window.location.search);
        const code = queryParams.get("code");

        await axios.post(`${import.meta.env.VITE_API_URL}/auth/login/social`, {
            provider: "GOOGLE",
            providerCode: code
        });
        navigate("/complete-join");
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
        privacy: "[선택] 개인정보 처리방침에 동의합니다"
    };

    const onSubmit = async (data: FormValues) => {
        if (!checkboxes.age || !checkboxes.privacy || !checkboxes.terms) {
            setTermsError("이용약관에 동의해주세요");
            return;
        }

        const { email, password, name } = data;
        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/auth/register/email`,
                { email, password, name }
            );
            navigate("/complete-join");
        } catch (e) {
            if (axios.isAxiosError(e) && e.response) {
                if (e.response.status === 409) {
                    setError("email", {
                        type: "manual",
                        message:
                            "이미 가입된 이메일 주소입니다. 다른 이메일 주소를 입력해 주세요."
                    });
                }
            }
            if (e instanceof Error) throw new Error(e.message);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full max-w-md mx-auto p-6 space-y-4">
                <div className="flex">로고</div>
                <div className="text-2xl font-bold text-center">회원가입</div>
                <img
                    src={GoogleBtn}
                    alt="Google Sign Up"
                    className="w-full cursor-pointer transition-transform duration-300"
                    onClick={handleGoogleClick}
                />
                <div className="space-x-2 mt-4 flex items-center">
                    <span className="w-full border-b"></span>
                </div>
                <div className="space-y-4">
                    <div className="flex flex-col">
                        <label
                            htmlFor="name"
                            className="text-left font-Pretendard mb-2"
                        >
                            닉네임
                        </label>
                        <input
                            {...register("name", {
                                required: "닉네임을 입력해주세요.",
                                maxLength: {
                                    value: 50,
                                    message: "최대 50자까지 입력 가능합니다"
                                },
                                minLength: {
                                    value: 1,
                                    message: "최소 1자 이상 입력해야합니다"
                                },
                                pattern: {
                                    value: /^[가-힣a-zA-Z0-9\s!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{1,50}$/,
                                    message: "이름을 다시 확인해주세요."
                                }
                            })}
                            className={getInputErrorClassName(errors.name)}
                            placeholder="닉네임"
                        />

                        {errors ? (
                            <span className="text-red-500">
                                {errors?.name?.message}
                            </span>
                        ) : null}
                    </div>
                    <div className="flex flex-col">
                        <label
                            htmlFor="email"
                            className="text-left font-Pretendard mb-2"
                        >
                            이메일
                        </label>
                        <input
                            placeholder="abc@email.com"
                            className={getInputErrorClassName(errors.email)}
                            {...register("email", {
                                required: "이메일을 입력해주세요",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "올바른 이메일 형식이 아닙니다."
                                }
                            })}
                        />
                        {errors ? (
                            <span className="text-red-500">
                                {errors?.email?.message}
                            </span>
                        ) : null}
                    </div>
                    <div className="relative flex flex-col">
                        <label
                            htmlFor="password"
                            className="text-left font-Pretendard mb-2"
                        >
                            비밀번호
                        </label>
                        <input
                            type={password.type}
                            placeholder="비밀번호 확인"
                            className={getInputErrorClassName(errors.password)}
                            {...register("password", {
                                required: "비밀번호를 입력해주세요",
                                pattern: {
                                    value: /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/,
                                    message:
                                        "비밀번호 취약: 비밀번호는 8~16자의 영문 대/소문자, 숫자, 특수문자를 모두 포함해야 합니다."
                                }
                            })}
                        />
                        {errors
                            ? errors.password && (
                                  <span className="text-red-500">
                                      {errors?.password?.message}
                                  </span>
                              )
                            : null}
                        <span className="flex justify-end items-center">
                            <img
                                src={handleEyeIconToggle()}
                                alt="Toggle Password Visibility"
                                className="absolute inset-y-12 end-3 cursor-pointer"
                                onClick={handleToggle}
                            />
                        </span>
                    </div>
                    <div className="relative flex flex-col">
                        <label
                            htmlFor="confirmPassword"
                            className="text-left font-Pretendard mb-2"
                        >
                            비밀번호 확인
                        </label>
                        <input
                            type={confirmPassword.type}
                            placeholder="비밀번호 확인"
                            className={getInputErrorClassName(
                                errors.confirmPassword
                            )}
                            {...register("confirmPassword", {
                                required: "비밀번호 확인을 해주세요",
                                validate: (value) =>
                                    value === watch("password") ||
                                    "비밀번호가 일치하지 않습니다."
                            })}
                        />
                        {errors
                            ? errors.confirmPassword && (
                                  <span className="text-red-500">
                                      {errors?.confirmPassword?.message}
                                  </span>
                              )
                            : null}
                        <span className="flex justify-end items-center">
                            <img
                                src={handleConfirmEyeIconToggle()}
                                alt="Toggle Password Visibility"
                                className="absolute inset-y-12 end-3 cursor-pointer"
                                onClick={handleConfirmToggle}
                            />
                        </span>
                    </div>
                </div>
                <div>
                    <span className="flex justify-start mb-4 font-Pretendard">
                        약관동의
                    </span>
                    <div
                        className="flex items-center space-x-2 cursor-pointer"
                        onClick={handleAllCheckboxes}
                    >
                        {isAllChecked ? (
                            <img src={CheckboxBlack} alt="" className="mr-1" />
                        ) : (
                            <img
                                src={CheckboxOutline}
                                alt=""
                                className="mr-1"
                            />
                        )}
                        <div className="flex w-screen justify-start">
                            <label className="text-sm font-medium font-Pretendard leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                전체동의
                            </label>
                        </div>
                    </div>
                    <div className="space-x-2 mt-4 flex items-center">
                        <span className="w-full border-b" />
                    </div>
                </div>
                <div className="space-y-2 font-Pretendard">
                    {Object.entries(checkboxLabels).map(([key, label]) => (
                        <Checkbox
                            key={key}
                            label={label}
                            isChecked={checkboxes[key as keyof CheckboxState]}
                            onToggle={() =>
                                handleCheckboxToggle(key as keyof CheckboxState)
                            }
                        />
                    ))}
                    {termsError && (
                        <p className="text-red-500 text-sm">{termsError}</p>
                    )}
                </div>
                <button
                    className="w-full bg-black text-white rounded-[10px] h-[52px] font-Pretendard"
                    type="submit"
                >
                    회원가입
                </button>
            </div>
        </form>
    );
};

export default Join;
