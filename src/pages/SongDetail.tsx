import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import useUserData from "../hooks/useUserData";
import CameraImg from "../components/CameraImg";
import ImgProfileL from "../components/ImgProfileL";
import TriangleFill from "../assets/ic_TriangleFill.svg";
import { useForm } from "react-hook-form";
import axiosInstance from "../utils/axiosInstance";
import getInputErrorClassName from "../utils/className";
import { useModal } from "../hooks/useModal";
import axios from "axios";
import SongRequestFailModal from "../components/Modal/SongRequestFailModal";
import SongRequestSuccessModal from "../components/Modal/SongRequestSuccessModal";
import EmailInputModal from "../components/Modal/EmailInputModal";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ModalType } from "../types";
import { useTitle } from "../utils/useTitle";

interface SongDetailForm {
    artist: string;
    title: string;
}

const SongDetail = () => {
    const setTitle = useTitle();

    setTimeout(() => {
        setTitle("신청곡 상세");
    }, 100);

    const [searchParams] = useSearchParams();
    const formId = searchParams.get("id")!;
    const navigate = useNavigate();
    const { data: userData } = useUserData();
    const profileImage = userData?.image;

    const [userId, setUserId] = useState<string>("");

    const { openModal } = useModal();

    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues
    } = useForm<SongDetailForm>();

    const isLoggedIn = !!userData;

    useEffect(() => {
        async function fetchRequestForm() {
            if (formId) {
                try {
                    const { data: id } = await axiosInstance().get(
                        `/users/form/${formId}`
                    );
                    setUserId(id);
                } catch {
                    throw new Error("Failed to fetch user form");
                }
            }
        }
        fetchRequestForm();
    }, [formId]);

    const handlePostSong = async () => {
        const { artist, title } = getValues();
        const { email } = userData ?? { email: "" };

        if (isLoggedIn && artist && title) {
            await axiosInstance().post("/songs", {
                userId: formId,
                email,
                artist,
                title
            });
            openModal({
                title: "신청 완료",
                type: ModalType.SUCCESS,
                Content: SongRequestSuccessModal,
                data: { artist, title, formId, email },
                buttonBackgroundColor:
                    "bg-gradient-to-br from-[#7B92C7] via-[#7846DD] to-[#BB7FA0]"
            });
        }
        if (!isLoggedIn) {
            openModal({
                Content: (props) => (
                    <EmailInputModal
                        {...props}
                        navigate={navigate}
                        modalData={{ artist, title, formId, userData }}
                    />
                ),
                title: "싱포유 회원이시면",
                type: ModalType.DEFAULT,
                buttonBackgroundColor:
                    "bg-gradient-to-br from-[#7B92C7] via-[#7846DD] to-[#BB7FA0]"
            });
        }
    };

    const onSubmit = async ({ artist, title }: SongDetailForm) => {
        const { email } = userData ?? { email: "" };
        try {
            //
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 409) {
                    openModal({
                        title: "신청 실패",
                        type: ModalType.ERROR,
                        Content: SongRequestFailModal,
                        data: { artist, title, userId, email },
                        buttonBackgroundColor:
                            "bg-gradient-to-br from-[#7B92C7] via-[#7846DD] to-[#BB7FA0]"
                    });
                }
            }
            // 409 에러 처리
        }
    };

    const inputLabelClass =
        "w-[328px] h-[17px] font-medium text-[14px] leading-[16.71px] text-black mb-2";

    return (
        <div className="flex flex-col justify-center items-center w-full max-w-md flex-grow mt-2 mx-auto">
            <Navbar />
            <div className="relative flex flex-col w-full justify-center items-center">
                <div
                    className="relative w-[90px] h-[90px] cursor-pointer mt-3"
                    onClick={() =>
                        document.getElementById("profileImageInput")?.click()
                    }
                >
                    {profileImage ? (
                        typeof profileImage === "string" ? (
                            <img
                                src={profileImage}
                                alt="Profile"
                                className="w-full h-full object-cover rounded-full "
                            />
                        ) : (
                            <img
                                src={URL.createObjectURL(profileImage)}
                                alt="Profile"
                                className="w-full h-full object-cover rounded-full "
                            />
                        )
                    ) : (
                        <ImgProfileL />
                    )}
                    <div className="absolute w-[24px] h-[24px] top-[66px] left-[66px] rounded-full border">
                        <CameraImg />
                    </div>
                </div>
                <input
                    type="file"
                    id="profileImageInput"
                    accept="image/*"
                    className="hidden"
                />
                {/* <div className="w-[90px] h-[16px] font-medium text-[13px] leading-[15.51px] text-center cursor-pointer text-customGray">
                    이미지삭제
                </div> */}
                <span className="font-bold text-lg mt-4">{userData?.name}</span>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col mt-[22px]"
                >
                    <div className="flex flex-col gap-1">
                        <label htmlFor="가수" className={inputLabelClass}>
                            가수
                        </label>
                        <input
                            type="text"
                            placeholder="가수이름"
                            className={`rounded-md px-4 h-[48px] text-sm mb-11 ${getInputErrorClassName(
                                errors.artist
                            )}`}
                            {...register("artist", {
                                required: "가수 이름을 입력해주세요."
                            })}
                        />
                        {errors.artist && (
                            <span className="text-red-500 text-sm">
                                {errors.artist.message}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="노래 제목" className={inputLabelClass}>
                            노래 제목
                        </label>
                        <input
                            type="text"
                            placeholder="노래 제목"
                            className={`rounded-md px-4 h-[48px] text-sm ${getInputErrorClassName(
                                errors.title
                            )}`}
                            {...register("title", {
                                required: "노래 제목을 입력해주세요."
                            })}
                        />
                        {errors.title && (
                            <span className="text-red-500 text-sm">
                                {errors.title.message}
                            </span>
                        )}
                    </div>
                    <div className="flex justify-center items-center gap-2 my-[22px]">
                        <img src={TriangleFill} alt="warning" />
                        <span className="font-pretendard text-sm">
                            제출 후 수정이 불가능합니다.
                        </span>
                    </div>
                    <button
                        onClick={handlePostSong}
                        className="flex items-center justify-center gap-2  bg-gradient-to-br from-[#7B92C7] via-[#7846DD] to-[#BB7FA0] text-white px-4 py-3 rounded-lg hover:opacity-90 transition-opacity"
                    >
                        신청곡 보내기
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SongDetail;
