import React, { useState } from "react";
import getInputErrorClassName from "../../utils/className";
import { NavigateFunction } from "react-router-dom";
import { useModal } from "../../hooks/useModal";

interface EmailInputModalProps {
    navigate: NavigateFunction;
}

const EmailInputModal = ({ navigate }: EmailInputModalProps) => {
    const [email, setEmail] = useState("");
    const { closeModal } = useModal();

    const handleClickLogin = () => {
        navigate("/login");
        closeModal();
    };

    const handleClickSongDetail = () => {
        closeModal();
        navigate("/song-detail");
    };

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };
    return (
        <div className="h-96">
            <button
                onClick={handleClickLogin}
                className="bg-colorPurple w-full h-12 rounded-md text-white text-[14px] font-pretendard font-semibold"
            >
                로그인
            </button>
            {/* border 추가 */}
            <div className="space-x-2 mt-4 mb-12 flex items-center">
                <span className="w-full border-b"></span>
            </div>
            <h2 className="font-bold text-[18px]">
                아직, <br /> 싱포유 회원이 아니시면,
            </h2>
            <form className="flex flex-col" onSubmit={onSubmit}>
                <label
                    className="mt-2 font-semibold text-[14px]"
                    htmlFor="이메일"
                >
                    이메일
                </label>
                <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="이메일 입력"
                    className={`border-[0.5px] border-inputBorderColor ${getInputErrorClassName} placeholder:text-[14px] mt-2`}
                />
                <button
                    onClick={handleClickSongDetail}
                    className="bg-colorPurple w-full h-12 rounded-md mt-10 text-white text-[14px] font-pretendard font-semibold"
                >
                    비회원으로 신청하기
                </button>
            </form>
        </div>
    );
};

export default EmailInputModal;
