import React, { useState } from "react";
import getInputErrorClassName from "../../utils/className";
import { NavigateFunction } from "react-router-dom";
import { useModal } from "../../hooks/useModal";
import axiosInstance from "../../utils/axiosInstance";
import { UserData } from "../../hooks/useUserData";
import { ModalType } from "../../types";
import SongRequestSuccessModal from "./SongRequestSuccessModal";
import axios from "axios";
import SongRequestFailModal from "./SongRequestFailModal";

interface SongData {
    artist: string;
    title: string;
    formId: string | null;
    userData?: UserData;
    email?: string;
}

interface EmailInputModalProps<T extends SongData> {
    navigate: NavigateFunction;
    modalData?: T;
    onRequestComplete: () => void;
}

export default function EmailInputModal<T extends SongData>({
    navigate,
    modalData,
    onRequestComplete
}: EmailInputModalProps<T>) {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const { openModal, closeModal } = useModal();

    const formId = modalData && modalData.formId;

    const handleClickLogin = () => {
        navigate("/login");
        closeModal();
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
        try {
            await axiosInstance().post("/songs", {
                userId: formId,
                email,
                artist: modalData?.artist,
                title: modalData?.title
            });
            closeModal();
            // 신청완료 모달 띄우기
            openModal({
                title: "신청 완료",
                type: ModalType.SUCCESS,
                Content: SongRequestSuccessModal,
                data: {
                    artist: modalData?.artist,
                    title: modalData?.title,
                    email: modalData?.email,
                    formId
                },
                buttonBackgroundColor:
                    "bg-gradient-to-br from-[#7B92C7] via-[#7846DD] to-[#BB7FA0]",
                onClose: onRequestComplete
            });
        } catch (error) {
            if (error instanceof Error) {
                if (
                    axios.isAxiosError(error) &&
                    error.response?.status === 409
                ) {
                    const { detail } = error.response.data;
                    openModal({
                        title: "중복 신청",
                        type: ModalType.ERROR,
                        Content: SongRequestFailModal,
                        data: {
                            existingRequest: {
                                artist: detail.artist,
                                title: detail.title,
                                email: detail.email
                            }
                        },
                        buttonBackgroundColor:
                            "bg-gradient-to-br from-[#7B92C7] via-[#7846DD] to-[#BB7FA0]",
                        onClose: onRequestComplete
                    });
                }
            }
        }
    };

    // 이메일이 비어있는 경우 버튼 비활성화
    const isButtonDisabled = !email.trim();
    console.log(isButtonDisabled);
    return (
        <div>
            <button
                onClick={handleClickLogin}
                className="bg-colorPurple w-full h-12 rounded-lg text-white mobile:text-[14px] tablet:text-[14px] pc:text-base font-bold"
            >
                로그인
            </button>
            {/* border 추가 */}
            <div className="space-x-2 pc:my-12 mobile:my-10 tablet:my-10 flex items-center">
                <span className="w-full border-b"></span>
            </div>
            <h2 className="font-bold pc:text-2xl mobile:text-lg tablet:text-lg">
                아직, <br /> 싱포유 회원이 아니시면,
            </h2>
            <form className="flex flex-col" onSubmit={onSubmit}>
                <label
                    className="mobile:mt-[22px] tablet:mt-[22px] pc:mt-[30px] font-medium text-[14px]"
                    htmlFor="새 이메일"
                >
                    <span className="font-medium mobile:text-[14px] tablet:text-[14px] pc:text-base">
                        새 이메일
                    </span>
                </label>
                <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="이메일 입력"
                    className={`border-[0.5px] border-inputBorderColor placeholder:font-normal ${
                        error ? "border-errorTextColor" : ""
                    } ${getInputErrorClassName} placeholder:pc:text-[14px] placeholder:mobile:text-base mt-2`}
                />

                <p className="mobile:mt-2 tablet:mt-2 pc:my-2 text-[12px] text-errorTextColor mobile:mb-[22px] tablet:mb-[22px] pc:mb-[22px]">
                    {error}
                </p>
                <button
                    disabled={isButtonDisabled}
                    className="disabled:bg-buttonColor2 disabled:cursor-not-allowed bg-black w-full h-12 rounded-lg text-white mobile:text-[14px] tablet:text-[14px] pc:text-base font-bold"
                >
                    비회원으로 신청하기
                </button>
            </form>
        </div>
    );
}
