import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import useUserData from "../hooks/useUserData";
import ImgProfileL from "../components/ImgProfileL";
import TriangleFillRed from "../assets/ic_TriangleFill_red.svg";
import { useForm } from "react-hook-form";
import axiosInstance from "../utils/axiosInstance";
import getInputErrorClassName from "../utils/className";
import { useModal } from "../hooks/useModal";
import axios from "axios";
import SongRequestFailModal from "../components/Modal/SongRequestFailModal";
import SongRequestSuccessModal from "../components/Modal/SongRequestSuccessModal";
import EmailInputModal from "../components/Modal/EmailInputModal";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ModalType } from "../types";
import { useTitle } from "../hooks/useTitle";
import Footer from "../components/Footer";
import MypageProfile from "../components/MypageProfileL";
import Mypage from "./Mypage";

interface SongDetailForm {
    artist: string;
    title: string;
}

interface User {
    id: string;
    name: string;
    image: string | null;
    isOpened: boolean;
}

const SongDetail = () => {
    const location = useLocation();
    const user = location.state as { user: User };
    const [fetchedUser, setFetchedUser] = useState<User | null>(null);

    const setTitle = useTitle();

    setTimeout(() => {
        setTitle("신청곡 상세");
    }, 100);

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const formId = searchParams.get("formId");
    const { data: userData } = useUserData();
    const profileImage =
        user?.user?.image || fetchedUser?.image || userData?.image;

    const { openModal } = useModal();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm<SongDetailForm>();

    const resetFields = () => {
        setValue("artist", "");
        setValue("title", "");
    };

    // const isLoggedIn = !!userData;

    useEffect(() => {
        async function fetchRequestForm() {
            if (typeof formId === "string") {
                if (formId) {
                    try {
                        const { data } = await axiosInstance().get(
                            `/users/form/${formId}`
                        );

                        setFetchedUser(data);
                    } catch {
                        throw new Error("Failed to fetch user form");
                    }
                }
            }
        }
        fetchRequestForm();
    }, [formId]);

    const onSubmit = async ({ artist, title }: SongDetailForm) => {
        const { email } = userData ?? { email: "" };

        try {
            const res = await axiosInstance().post("/songs", {
                userId: formId,
                email,
                artist,
                title
            });

            if (res.status === 201) {
                openModal({
                    title: "신청 완료",
                    type: ModalType.SUCCESS,
                    Content: SongRequestSuccessModal,
                    data: { artist, title, formId, email },
                    buttonBackgroundColor:
                        "bg-gradient-to-br from-[#7B92C7] via-[#7846DD] to-[#BB7FA0]",
                    onClose: resetFields
                });
                resetFields();
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 409) {
                    openModal({
                        title: "중복 신청",
                        type: ModalType.ERROR,
                        Content: SongRequestFailModal,
                        data: { artist, title, email },
                        buttonBackgroundColor:
                            "bg-gradient-to-br from-[#7B92C7] via-[#7846DD] to-[#BB7FA0]",
                        onClose: () => {
                            resetFields();
                        }
                    });
                } else if (error.response.status === 400) {
                    openModal({
                        Content: (props) => (
                            <EmailInputModal
                                {...props}
                                navigate={navigate}
                                modalData={{ artist, title, formId, userData }}
                                onRequestComplete={resetFields}
                            />
                        ),
                        title: "싱포유 회원이시면",
                        type: ModalType.NOTLOGIN,
                        buttonBackgroundColor: ""
                    });
                }
            }
        }
    };
    const userName = user?.user?.name || fetchedUser?.name;

    const inputLabelClass =
        "w-[328px] h-[17px] font-medium text-[14px] leading-[16.71px] text-black mb-2";

    return (
        <div className="flex flex-col justify-center items-center w-full max-w-md flex-grow mt-2 mx-auto">
            <Navbar />
            {user?.user?.isOpened && (
                <div className="relative flex flex-col w-full justify-center items-center mt-10">
                    <div className="relative w-[90px] h-[90px] cursor-pointer mt-3">
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
                            <MypageProfile />
                        )}
                    </div>
                    <input
                        type="file"
                        id="profileImageInput"
                        accept="image/*"
                        className="hidden"
                    />

                    <span className="font-bold text-lg mt-4">
                        {userName || "Loading...."}
                    </span>
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
                                className={`rounded-md px-4 h-[48px] ${
                                    errors.artist ? "" : "mb-[22px]"
                                } text-sm ${getInputErrorClassName(
                                    errors.artist
                                )}`}
                                {...register("artist", {
                                    required: "가수 이름을 입력해주세요."
                                })}
                            />
                            {errors.artist && (
                                <span className="text-red-500 text-sm mb-[30px]">
                                    {errors.artist.message}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label
                                htmlFor="노래 제목"
                                className={inputLabelClass}
                            >
                                노래 제목
                            </label>
                            <input
                                type="text"
                                placeholder="가수이름"
                                className={`rounded-md px-4 h-[48px] ${
                                    errors.title ? "" : "mb-[22px]"
                                } text-sm ${getInputErrorClassName(
                                    errors.title
                                )}`}
                                {...register("title", {
                                    required: "가수 이름을 입력해주세요."
                                })}
                            />
                            {errors.title && (
                                <span className="text-red-500 text-sm mb-[30px]">
                                    {errors.title.message}
                                </span>
                            )}
                        </div>
                        <div className="flex justify-center items-center gap-2 my-[22px]">
                            <img src={TriangleFillRed} alt="warning" />
                            <span className="font-pretendard text-sm">
                                제출 후 수정이 불가능합니다.
                            </span>
                        </div>
                        <button className="flex items-center justify-center gap-2  bg-gradient-to-br from-[#7B92C7] via-[#7846DD] to-[#BB7FA0] text-white px-4 py-3 rounded-lg hover:opacity-90 transition-opacity">
                            신청곡 보내기
                        </button>
                    </form>
                </div>
            )}

            {!user?.user?.isOpened && (
                <div className="relative flex flex-col w-full justify-center items-center mt-10">
                    <div
                        className="relative w-[90px] h-[90px] cursor-pointer mt-3"
                        onClick={() =>
                            document
                                .getElementById("profileImageInput")
                                ?.click()
                        }
                    >
                        {profileImage ? (
                            typeof profileImage === "string" ? (
                                <img
                                    src={profileImage}
                                    alt="Profile"
                                    className="w-full h-full object-cover rounded-full"
                                />
                            ) : (
                                <img
                                    src={URL.createObjectURL(profileImage)}
                                    alt="Profile"
                                    className="w-full h-full object-cover rounded-full "
                                />
                            )
                        ) : (
                            <MypageProfile />
                        )}
                    </div>
                    <input
                        type="file"
                        id="profileImageInput"
                        accept="image/*"
                        className="hidden"
                    />
                    <span className="font-bold text-lg mt-4">
                        {userName || "Loading...."}
                    </span>

                    <section className="w-[379px] h-[136px] bg-[#f5f5f5] mt-[38px] flex justify-center items-center text-center rounded-lg">
                        현재 아티스트가 신청곡을 받고 있지 않습니다. <br />
                        다음 신청 기간을 기다려 주세요.
                    </section>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default SongDetail;
