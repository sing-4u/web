import {
    ChangeEvent,
    Dispatch,
    FormEvent,
    SetStateAction,
    useState
} from "react";
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

type SetPasswordState = Dispatch<SetStateAction<PasswordState>>;

interface CheckboxState {
    age: boolean;
    privacy: boolean;
    marketing: boolean;
}

const Join = () => {
    const [nickName, setNickName] = useState("");
    const [email, setEmail] = useState("");
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

    const [errors, setErrors] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        nickName: ""
    });

    const [checkboxes, setCheckboxes] = useState<CheckboxState>({
        age: false,
        privacy: false,
        marketing: false
    });

    const isAllChecked = Object.values(checkboxes).every((box) => box);

    const handleToggle = (setState: SetPasswordState) => {
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

    const handleNickNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const { value } = event.target;
        setNickName(value);
        if (value === "") {
            setErrors({ ...errors, nickName: "닉네임을 입력하세요" });
        }
        // 닉네임은 최소 1글자 최대 50글자, 한글/영문(소문자/대문자),숫자, 특수문자로 구성되어야 함
        else if (value.length < 1 || value.length > 50) {
            setErrors({
                ...errors,
                nickName: "닉네임은 최소 1글자 최대 50글자입니다"
            });
        }
        // regex
        else if (
            !value.match(
                /^[가-힣a-zA-Z0-9\s!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{1,50}$/
            )
        ) {
            setErrors({
                ...errors,
                nickName:
                    "닉네임은 한글, 영문, 숫자, 특수문자로 구성되어야 합니다"
            });
        }
    };

    const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const { value } = event.target;
        setEmail(value);
        if (value === "") {
            setErrors({ ...errors, email: "이메일을 입력하세요" });
        }
        // 중복 불가, @ 필수, 1~50글자, 영문(소문자),숫자, 특수문자로 구성되어야 함
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            setErrors({
                ...errors,
                email: "올바른 이메일 형식이 아닙니다"
            });
        }
        // 1~50글자 제한
        else if (value.length < 1 || value.length > 50) {
            setErrors({
                ...errors,
                email: "이메일은 최소 1글자 최대 50글자입니다"
            });
        } else {
            setErrors({ ...errors, email: "" });
        }
    };

    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setPasswordState((prev) => ({ ...prev, value }));

        if (value === "") {
            setErrors((prev) => ({
                ...prev,
                password: "비밀번호를 입력하세요"
            }));
        } else if (
            !value.match(
                /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/
            )
        ) {
            setErrors((prev) => ({
                ...prev,
                password:
                    "비밀번호는 8~16자의 영문 대/소문자, 숫자, 특수문자를 모두 포함해야 합니다"
            }));
        } else {
            setErrors((prev) => ({ ...prev, password: "" }));
        }

        // 비밀번호가 변경될 때 확인 비밀번호와 일치하는지 검사
        if (confirmState.value) {
            if (value !== confirmState.value) {
                setErrors((prev) => ({
                    ...prev,
                    confirmPassword: "비밀번호가 일치하지 않습니다"
                }));
            } else {
                setErrors((prev) => ({ ...prev, confirmPassword: "" }));
            }
        }
    };

    const handleConfirmPasswordChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const { value } = event.target;
        setConfirmState((prev) => ({ ...prev, value }));

        if (value === "") {
            setErrors((prev) => ({
                ...prev,
                confirmPassword: "비밀번호를 입력하세요"
            }));
        } else if (value !== passwordState.value) {
            setErrors((prev) => ({
                ...prev,
                confirmPassword: "비밀번호가 일치하지 않습니다"
            }));
        } else {
            setErrors((prev) => ({ ...prev, confirmPassword: "" }));
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/auth/register/email`,
                {
                    email,
                    password: passwordState.value,
                    name: nickName
                }
            );
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
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
                        <label htmlFor="nickName" className="text-left">
                            닉네임
                        </label>
                        {/* 닉네임은 1~50글자 */}
                        <input
                            placeholder="닉네임"
                            type="text"
                            className="border border-slate-300 rounded-[10px] py-[14px] px-[18px]"
                            onChange={handleNickNameChange}
                        />
                        {errors ? (
                            <span className="text-red-500">
                                {errors.nickName}
                            </span>
                        ) : null}
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="email" className="text-left">
                            이메일
                        </label>
                        <input
                            placeholder="abc@email.com"
                            type="text"
                            className="border border-slate-300  rounded-[10px] py-[14px] px-[18px]"
                            onChange={handleEmailChange}
                        />
                        {errors ? (
                            <span className="text-red-500">{errors.email}</span>
                        ) : (
                            ""
                        )}
                    </div>
                    <div className="relative flex flex-col">
                        <label htmlFor="password" className="text-left">
                            비밀번호
                        </label>
                        <input
                            placeholder="비밀번호"
                            type={passwordState.type}
                            className="border border-slate-300  rounded-[10px] py-[14px] px-[18px]"
                            onChange={handlePasswordChange}
                        />
                        {errors.password && (
                            <span className="text-red-500 text-md mt-1">
                                {errors.password}
                            </span>
                        )}
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
                            type={confirmState.type}
                            className="border border-slate-300 rounded-[10px] py-[14px] px-[18px]"
                            onChange={handleConfirmPasswordChange}
                        />
                        {errors.confirmPassword && (
                            <span className="text-red-500 text-md mt-1">
                                {errors.confirmPassword}
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
