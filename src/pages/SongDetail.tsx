import React from "react";
import Navbar from "../components/Navbar";
import useUserData from "../hooks/useUserData";
import CameraImg from "../components/CameraImg";
import ImgProfileL from "../components/ImgProfileL";
import TriangleFill from "../assets/ic_TriangleFill.svg";
import { useForm } from "react-hook-form";
import axiosInstance from "../utils/axiosInstance";
import getInputErrorClassName from "../utils/className";
import { useModal } from "../hooks/useModal";
import { SongRequestData } from "../types";

interface SongDetailForm {
    artist: string;
    title: string;
}

const SongDetail = () => {
    const { data: userData } = useUserData();
    const profileImage = userData?.image;

    const { openModal } = useModal();

    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues
    } = useForm<SongDetailForm>();

    const handlePostSong = () => {
        const { artist, title } = getValues();
        const songData: SongRequestData = {
            artist,
            title
        };

        if (artist && title) {
            openModal("songRequestSuccess", songData);
        }
    };

    const onSubmit = async (data: SongDetailForm) => {
        const { id: userId, email } = userData ?? {
            id: "",
            email: ""
        };
        const { artist, title } = data;

        await axiosInstance().post("/songs", {
            userId,
            email,
            artist,
            title
        });
    };

    const inputLabelClass =
        "w-[328px] h-[17px] font-medium text-[14px] leading-[16.71px] text-black";

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
                <div className="w-[90px] h-[16px] mt-1 font-medium text-[13px] leading-[15.51px] text-center cursor-pointer text-customGray">
                    이미지삭제
                </div>
                <span className="font-bold text-lg">{userData?.name}</span>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col space-y-6"
                >
                    <div className="flex flex-col gap-1">
                        <label htmlFor="가수" className={inputLabelClass}>
                            가수
                        </label>
                        <input
                            type="text"
                            placeholder="가수이름"
                            className={`rounded-md px-4 h-[48px] text-sm ${getInputErrorClassName(
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
                    <div className="flex justify-center items-center gap-2">
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
