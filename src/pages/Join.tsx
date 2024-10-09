import { Dispatch, SetStateAction, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Icon from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";
import { IoIosCheckbox, IoIosCheckboxOutline } from "react-icons/io";
import Checkbox from "../components/Checkbox";
import GoogleBtn from "../../src/assets/btn.png";
import axios from "axios";

interface PasswordState {
    value: string;
    type: "password" | "text";
    icon: typeof eyeOff | typeof eye;
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
        control,
        formState: { errors }
    } = useForm<FormValues>(defaultValues);

    const [passwordState, setPasswordState] = useState<PasswordState>({
        type: "password",
        icon: eyeOff,
        value: ""
    });
    const [confirmState, setConfirmState] = useState<PasswordState>({
        type: "password",
        icon: eyeOff,
        value: ""
    });

    const [checkboxes, setCheckboxes] = useState<CheckboxState>({
        age: false,
        privacy: false,
        marketing: false
    });

    const isAllChecked = Object.values(checkboxes).every((box) => box);

    const handleToggle = (
        setState: Dispatch<SetStateAction<PasswordState>>
    ) => {
        setState((prevState) => {
            const isCurrentPassword = prevState.type === "password";
            return {
                ...prevState,
                type: isCurrentPassword ? "text" : "password",
                icon: isCurrentPassword ? eye : eyeOff
            };
        });
    };

    const handleCheckboxToggle = (name: keyof CheckboxState) => {
        setCheckboxes((prev) => ({ ...prev, [name]: !prev[name] }));
    };

    const handleAllCheckboxes = () => {
        const allChecked = Object.values(checkboxes).every((v) => v);
        setCheckboxes({
            age: !allChecked,
            privacy: !allChecked,
            marketing: !allChecked
        });
    };

    const checkboxLabels = {
        age: "[필수] 만 14세 이상입니다",
        privacy: "[필수] 이용약관에 동의합니다",
        marketing: "[필수] 개인정보 처리방침에 동의합니다"
    };

    const onSubmit = async (data: FormValues) => {
        const { email, password, name } = data;
        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/auth/register/email`,
                { email, password, name }
            );
        } catch (e) {
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
                <div className="space-y-4">
                    <div className="flex flex-col">
                        <label htmlFor="name" className="text-left">
                            닉네임
                        </label>
                        <Controller
                            name="name"
                            control={control}
                            rules={{
                                required: "닉네임을 입력하세요",
                                minLength: {
                                    value: 1,
                                    message: "닉네임은 최소 1글자입니다"
                                },
                                maxLength: {
                                    value: 50,
                                    message: "닉네임은 최대 50글자입니다"
                                },
                                pattern: {
                                    value: /^[가-힣a-zA-Z0-9\s!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{1,50}$/,
                                    message:
                                        "닉네임은 한글, 영문, 숫자, 특수문자로 구성되어야 합니다"
                                }
                            }}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    placeholder="닉네임"
                                    type="text"
                                    className="border border-slate-300 rounded-[10px] py-[14px] px-[18px]"
                                />
                            )}
                        />
                        {errors.name && (
                            <span className="text-red-500">
                                {errors?.name?.message}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="email" className="text-left">
                            이메일
                        </label>
                        <input
                            placeholder="abc@email.com"
                            className="border border-slate-300 rounded-[10px] py-[14px] px-[18px]"
                            {...register("email", {
                                required: "필수 응답 항목입니다.",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "이메일 형식이 아닙니다."
                                }
                            })}
                        />
                        {errors.email && (
                            <span className="text-red-500">
                                {errors?.email?.message}
                            </span>
                        )}
                    </div>
                    <div className="relative flex flex-col">
                        <label htmlFor="password" className="text-left">
                            비밀번호
                        </label>
                        <input
                            placeholder="비밀번호"
                            className="border border-slate-300 rounded-[10px] py-[14px] px-[18px]"
                            {...register("password", {
                                required: "필수 응답 항목입니다.",
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
                            <Icon
                                className="absolute inset-y-10 end-0 px-2.5 flex items-center z-20 hover:text-gray-600 cursor-pointer"
                                icon={passwordState.icon}
                                onClick={() => handleToggle(setPasswordState)}
                            />
                        </span>
                    </div>
                    <div className="relative flex flex-col">
                        <label htmlFor="confirmPassword" className="text-left">
                            비밀번호 확인
                        </label>
                        <input
                            placeholder="비밀번호 확인"
                            className="border border-slate-300 rounded-[10px] py-[14px] px-[18px]"
                            {...register("confirmPassword", {
                                required: "필수 응답 항목입니다.",
                                pattern: {
                                    value: /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/,
                                    message:
                                        "비밀번호는 8~16자의 영문 대/소문자, 숫자, 특수문자를 모두 포함해야 합니다"
                                }
                            })}
                        />
                        {errors.confirmPassword && (
                            <span className="text-red-500">
                                {errors?.confirmPassword?.message}
                            </span>
                        )}
                        <span className="flex justify-end items-center">
                            <Icon
                                className="absolute inset-y-10 end-0 px-2.5 flex items-center z-20 hover:text-gray-600 cursor-pointer"
                                icon={confirmState.icon}
                                onClick={() => handleToggle(setConfirmState)}
                            />
                        </span>
                    </div>
                </div>
                <div>
                    <span className="flex justify-start mb-4">약관동의</span>
                    <div
                        className="flex items-center space-x-2 cursor-pointer"
                        onClick={handleAllCheckboxes}
                    >
                        {isAllChecked ? (
                            <IoIosCheckbox size="24" />
                        ) : (
                            <IoIosCheckboxOutline size="24" />
                        )}
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            전체동의
                        </label>
                    </div>
                    <div className="space-x-2 mt-4 flex items-center">
                        <span className="w-full border-b" />
                    </div>
                </div>
                <div className="space-y-2">
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
                </div>
                <button
                    className="w-[328px] bg-black text-white rounded-[10px] h-[52px]"
                    type="submit"
                >
                    회원가입
                </button>
            </div>
        </form>
    );
};

export default Join;
