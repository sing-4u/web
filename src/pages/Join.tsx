import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import Checkbox from "../components/Checkbox";
import GoogleBtn from "../../src/assets/btn.png";
import axios from "axios";
import CheckboxOutline from "../../src/assets/_checkbox.png";
import CheckboxBlack from "../../src/assets/_checkbox_black.png";
import eyeOn from "../../src/assets/icons_pw_on.png";
import eyeOff from "../../src/assets/icons_pw_off.png";
import { useNavigate } from "react-router-dom";

interface PasswordState {
    value: string;
    type: "password" | "text";
}

interface FormValues {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface CheckboxState {
    age: boolean;
    privacy: boolean;
    marketing: boolean;
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
        formState: { errors }
    } = useForm<FormValues>(defaultValues);

    const [passwordState, setPasswordState] = useState<PasswordState>({
        type: "password",
        value: ""
    });
    const [confirmState, setConfirmState] = useState<PasswordState>({
        type: "password",

        value: ""
    });

    const [checkboxes, setCheckboxes] = useState<CheckboxState>({
        age: false,
        privacy: false,
        marketing: false
    });

    const [termsError, setTermsError] = useState("");

    const isAllChecked = Object.values(checkboxes).every((box) => box);

    const handleToggle = (
        setState: Dispatch<SetStateAction<PasswordState>>
    ) => {
        setState((prevState) => {
            const isCurrentPassword = prevState.type === "password";
            return {
                ...prevState,
                type: isCurrentPassword ? "text" : "password"
            };
        });
    };

    const handleCheckboxToggle = (name: keyof CheckboxState) => {
        setCheckboxes((prev) => ({ ...prev, [name]: !prev[name] }));
        setTermsError("");
    };

    const handleAllCheckboxes = () => {
        const allChecked = Object.values(checkboxes).every((v) => v);
        setCheckboxes({
            age: !allChecked,
            privacy: !allChecked,
            marketing: !allChecked
        });
        setTermsError("");
    };

    const checkboxLabels = {
        age: "[필수] 만 14세 이상입니다",
        privacy: "[필수] 이용약관에 동의합니다",
        marketing: "[필수] 개인정보 처리방침에 동의합니다"
    };

    const onSubmit = async (data: FormValues) => {
        if (!checkboxes.age || !checkboxes.privacy || !checkboxes.marketing) {
            setTermsError("이용약관에 동의해주세요");
            return;
        }

        const { email, password, name } = data;
        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/auth/register/email`,
                { email, password, name }
            );
            navigate("/complete");
        } catch (e) {
            if (axios.isAxiosError(e) && e.response) {
                if (e.response.status === 409) {
                    setError("email", {
                        type: "manual",
                        message: "이미 사용 중인 이메일입니다."
                    });
                }
            }
            if (e instanceof Error) throw new Error(e.message);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full max-w-md mx-auto p-6 space-y-6 h-full">
                <div className="flex">로고</div>
                <div className="text-2xl font-bold text-center">회원가입</div>
                <img
                    src={GoogleBtn}
                    alt="Google Sign Up"
                    className="w-full cursor-pointer transition-transform duration-300"
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
                                required: true,
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
                            className={`border rounded-[10px] py-[14px] px-[18px] placeholder:font-Pretendard ${
                                errors.name
                                    ? "border-[#FF4242]"
                                    : "border-black"
                            }`}
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
                            className={`border rounded-[10px] py-[14px] px-[18px] placeholder:font-Pretendard ${
                                errors.email
                                    ? "border-[#FF4242]"
                                    : "border-black"
                            }`}
                            {...register("email", {
                                required: true,
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
                            type={passwordState.type}
                            placeholder="비밀번호"
                            className={`border rounded-[10px] py-[14px] px-[18px] placeholder:font-Pretendard ${
                                errors.password
                                    ? "border-[#FF4242]"
                                    : "border-black"
                            }`}
                            {...register("password", {
                                required: true,
                                pattern: {
                                    value: /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/,
                                    message:
                                        "비밀번호는 8~16자의 영문 대/소문자, 숫자, 특수문자를 모두 포함해야 합니다."
                                }
                            })}
                        />
                        <span className="text-red-500">
                            {errors?.password?.message}
                        </span>

                        <span className="flex justify-end items-center">
                            <img
                                src={
                                    passwordState.type === "password"
                                        ? eyeOff
                                        : eyeOn
                                }
                                alt="Toggle Confirm Password Visibility"
                                className="absolute inset-y-12 end-3 cursor-pointer"
                                onClick={() => handleToggle(setPasswordState)}
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
                            type={confirmState.type}
                            placeholder="비밀번호 확인"
                            className={`border rounded-[10px] py-[14px] px-[18px] placeholder:font-Pretendard ${
                                errors.confirmPassword
                                    ? "border-[#FF4242]"
                                    : "border-black"
                            }`}
                            {...register("confirmPassword", {
                                required: true,
                                validate: (value) =>
                                    value !== passwordState.value ||
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
                                src={
                                    confirmState.type === "password"
                                        ? eyeOff
                                        : eyeOn
                                }
                                alt="Toggle Password Visibility"
                                className="absolute inset-y-12 end-3 cursor-pointer"
                                onClick={() => handleToggle(setConfirmState)}
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
