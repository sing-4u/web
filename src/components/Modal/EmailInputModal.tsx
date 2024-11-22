import React, { useState } from "react";
import getInputErrorClassName from "../../utils/className";
import { NavigateFunction } from "react-router-dom";
import { useModal } from "../../hooks/useModal";
import axiosInstance from "../../utils/axiosInstance";
import { UserData } from "../../hooks/useUserData";
import ErrorMessage from "../ErrorMessage";

interface SongData {
    artist: string;
    title: string;
    formId: string | null;
    userData?: UserData;
}

interface EmailInputModalProps<T extends SongData> {
    navigate: NavigateFunction;
    modalData?: T;
}

export default function EmailInputModal<T extends SongData>({
    navigate,
    modalData
}: EmailInputModalProps<T>) {
    console.log(modalData);
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const { closeModal } = useModal();

    const formId = modalData?.formId;

    const handleClickLogin = () => {
        navigate("/login");
        closeModal();
    };

    const handleClickSongDetail = async () => {
        if (!email.trim()) {
            setError("이메일을 입력해주세요.");
            return;
        }
        await axiosInstance().post("/songs", {
            userId: formId,
            email,
            artist: modalData?.artist,
            title: modalData?.title
        });
    };

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
        if (error) setError("");
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email.trim()) {
            setError("이메일을 입력해주세요.");
            return;
        }
    };
    return (
        <div>
            <button
                onClick={handleClickLogin}
                className="bg-colorPurple w-full h-12 rounded-md text-white text-[14px] font-semibold"
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
                    className={`border-[0.5px] border-inputBorderColor ${
                        error ? "border-red-500" : ""
                    } ${getInputErrorClassName} placeholder:text-[14px] mt-2`}
                />
                <ErrorMessage errors={error} />
                <button
                    onClick={handleClickSongDetail}
                    className="bg-colorPurple w-full h-12 rounded-md mt-10 text-white text-[14px] font-semibold"
                >
                    비회원으로 신청하기
                </button>
            </form>
        </div>
    );
}
