import { Dispatch, SetStateAction, useState, useEffect } from "react";
import Icon from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";
import { IoIosCheckbox, IoIosCheckboxOutline } from "react-icons/io";
import { BiChevronRight } from "react-icons/bi";

interface PasswordState {
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
    const [passwordState, setPasswordState] = useState<PasswordState>({
        type: "password",
        icon: eyeOff
    });
    const [confirmState, setConfirmState] = useState<PasswordState>({
        type: "password",
        icon: eyeOff
    });

    const [checkboxes, setCheckboxes] = useState<CheckboxState>({
        age: false,
        privacy: false,
        marketing: false
    });

    // 페이지 로드 시 체크박스 초기화
    useEffect(() => {
        setCheckboxes({
            age: false,
            privacy: false,
            marketing: false
        });
    }, []);

    const handleToggle = (setState: SetPasswordState) => {
        setState(
            (prevState: PasswordState): PasswordState => ({
                type: prevState.type === "password" ? "text" : "password",
                icon: prevState.type === "password" ? eye : eyeOff
            })
        );
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

    const isAllChecked = Object.values(checkboxes).every((v) => v);

    return (
        <div className="w-full max-w-md mx-auto p-6 space-y-6 h-full">
            <div className="flex">로고</div>
            <div className="text-2xl font-bold text-center">회원가입</div>
            {/* 버튼 추가 필요 */}
            <button className="w-full justify-start space-x-2">
                <span>Google로 회원가입</span>
            </button>

            <div className="space-y-4">
                <div className="flex flex-col">
                    <label htmlFor="nickName" className="text-left">
                        닉네임
                    </label>
                    <input
                        placeholder="닉네임"
                        type="text"
                        className="border border-slate-300 rounded-[10px] py-[14px] px-[18px]"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="email" className="text-left">
                        이메일
                    </label>
                    <input
                        placeholder="abc@email.com"
                        type="text"
                        className="border border-slate-300  rounded-[10px] py-[14px] px-[18px]"
                    />
                </div>
                <div className="relative flex flex-col">
                    <label htmlFor="password" className="text-left">
                        비밀번호
                    </label>
                    <input
                        placeholder="비밀번호"
                        type={passwordState.type}
                        className="border border-slate-300  rounded-[10px] py-[14px] px-[18px]"
                    />
                    <span className="flex justify-end items-center">
                        <Icon
                            className="right-[1.5rem] bottom-4 absolute hover:text-gray-600 cursor-pointer"
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
                    />
                    <span className="flex justify-end items-center">
                        <Icon
                            className="right-[1.5rem] bottom-4 absolute hover:text-gray-600 cursor-pointer"
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
                <div
                    className="flex justify-start items-center space-x-2 cursor-pointer"
                    onClick={() => handleCheckboxToggle("age")}
                >
                    {checkboxes.age ? (
                        <IoIosCheckbox size="24" />
                    ) : (
                        <IoIosCheckboxOutline size="24" />
                    )}
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        [필수] 만 14세 이상입니다
                    </label>
                    <BiChevronRight className="absolute right-64" size="24" />
                </div>
                <div
                    className="flex justify-start items-center space-x-2 cursor-pointer"
                    onClick={() => handleCheckboxToggle("privacy")}
                >
                    {checkboxes.privacy ? (
                        <IoIosCheckbox size="24" />
                    ) : (
                        <IoIosCheckboxOutline size="24" />
                    )}
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        [필수] 이용약관에 동의합니다
                    </label>
                    <BiChevronRight className="absolute right-64" size="24" />
                </div>
                <div
                    className="flex justify-start items-center space-x-2 cursor-pointer"
                    onClick={() => handleCheckboxToggle("marketing")}
                >
                    {checkboxes.marketing ? (
                        <IoIosCheckbox size="24" />
                    ) : (
                        <IoIosCheckboxOutline size="24" />
                    )}
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        [필수] 개인정보 처리방침에 동의합니다
                    </label>
                    <BiChevronRight className="absolute right-64" size="24" />
                </div>
            </div>
            <button
                className="w-[328px] bg-black text-white rounded-[10px] h-[52px]"
                type="submit"
            >
                회원가입
            </button>
        </div>
    );
};

export default Join;
