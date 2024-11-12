import { ChangeEvent, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import useUserData from "../hooks/useUserData";
import ImgProfileL from "../components/ImgProfileL";
import CameraImg from "../components/CameraImg";
import ChevronRightSmall from "../components/ChevronRightSmall";
import Footer from "../components/Footer";
import axios from "axios";
import { logout } from "../utils/Auth";
import { useNavigate } from "react-router-dom";
import DeleteAccountModal from "../utils/DeleteAccountModal";
import { useModal } from "../hooks/useModal";
import NicknameEditor from "../components/NicknameEditor";
import EmailChangeModal from "../components/Modal/EmailChangeModal";
import PasswordChangeModal from "../components/Modal/PasswordChangeModal";

const Mypage = () => {
    const { data: userData, refetch } = useUserData();
    const [nickname, setNickname] = useState(userData?.name || "");

    const [profileImage, setProfileImage] = useState<string | File | null>(
        userData?.image || null
    );
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        refetch();
        navigate("/");
    };

    const { openModal } = useModal();

    useEffect(() => {
        if (!userData) {
            navigate("/", { replace: true });
        }
    }, [userData, navigate]);

    useEffect(() => {
        if (userData?.name) {
            setNickname(userData.name);
        }
        if (userData?.image) {
            setProfileImage(userData.image);
        }
    }, [userData]);

    const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append("image", file);

            try {
                await axios.patch(
                    `${import.meta.env.VITE_API_URL}/users/me/image`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                            Authorization: `Bearer ${localStorage.getItem(
                                "accessToken"
                            )}`
                        }
                    }
                );
                setProfileImage(URL.createObjectURL(file));
                setErrorMessage(null);
            } catch {
                setErrorMessage(
                    "프로필 이미지 변경에 실패했습니다. 다시 시도해주세요."
                );
            }
        }
    };

    const handleImageDelete = async () => {
        try {
            await axios.patch(
                `${import.meta.env.VITE_API_URL}/users/me/image`,
                { image: null },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "accessToken"
                        )}`
                    }
                }
            );
            setProfileImage(null);
            setErrorMessage(null);
        } catch {
            setErrorMessage(
                "프로필 이미지 삭제에 실패했습니다. 다시 시도해주세요."
            );
        }
    };

    const openEmailModal = () => {
        openModal({
            title: "이메일 변경",
            Content: EmailChangeModal
        });
    };

    const openPasswordModal = () => {
        openModal({
            title: "비밀번호 변경",
            Content: PasswordChangeModal
        });
    };

    const inputLabelClass =
        "w-[328px] h-[17px] font-medium text-[14px] leading-[16.71px] text-black";
    const inputClass =
        "w-[328px] h-[52px] rounded-[10px] border border-inputBorderColor py-3.5 px-[18px] focus:outline-none focus:border-[1px] focus:border-black";
    const changeButtonClass =
        "bg-customGray absolute right-3 w-[61px] h-[30px] rounded-[5px] py-[8px] px-[20px] font-bold text-[12px] leading-[14.32px] bg-black text-[#FFFFFF]";

    return (
        <div className="min-h-screen flex flex-col items-center">
            <Navbar profileImage={profileImage} />
            <form className="flex flex-col items-center w-full max-w-md mt-2 flex-grow">
                <div className="flex flex-col w-[328px] h-[413px] gap-y-6">
                    <div className="relative flex flex-col w-full justify-center items-center">
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
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        <div
                            onClick={handleImageDelete}
                            className="w-[90px] h-[16px] mt-1 font-medium text-[13px] leading-[15.51px] text-center cursor-pointer text-customGray"
                        >
                            이미지삭제
                        </div>
                    </div>
                    {errorMessage && (
                        <div className="text-red-500 text-sm mt-2">
                            {errorMessage}
                        </div>
                    )}
                    <div className="flex flex-col gap-y-2">
                        <NicknameEditor
                            nickname={nickname}
                            setNickname={setNickname}
                            onError={setErrorMessage}
                        />
                    </div>
                    <div className="flex flex-col gap-y-2">
                        <label htmlFor="email" className={inputLabelClass}>
                            이메일
                        </label>
                        <div className="relative flex items-center">
                            <input
                                type="email"
                                id="email"
                                value={userData?.email || ""}
                                className={inputClass}
                                disabled
                            />
                            <button
                                type="button"
                                className={changeButtonClass}
                                onClick={openEmailModal}
                            >
                                변경
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col gap-y-2">
                        <label htmlFor="password" className={inputLabelClass}>
                            비밀번호
                        </label>
                        <div className="relative flex justify-center items-center">
                            <input
                                type="password"
                                id="password"
                                className={inputClass}
                            />
                            <button
                                type="button"
                                className={changeButtonClass}
                                onClick={openPasswordModal}
                            >
                                변경
                            </button>
                        </div>
                        <div className="flex justify-center w-full mt-6">
                            <button
                                onClick={handleLogout}
                                className="w-[328px] h-[52px] rounded-[10px] py-3.5 px-[18px] font-bold text-[14px] leading-[16.71px] bg-gray-200 text-customGray"
                            >
                                로그아웃
                            </button>
                        </div>
                        <div
                            onClick={() => setIsModalOpen(true)}
                            className="flex w-[327px] h-[17px] justify-start items-center font-normal text-[14px] leading-[16.71px] text-customGray mt-4 cursor-pointer"
                        >
                            탈퇴하기
                            <ChevronRightSmall />
                        </div>
                    </div>
                </div>
            </form>
            {isModalOpen && (
                <DeleteAccountModal closeModal={() => setIsModalOpen(false)} />
            )}
            <div className="">
                <Footer />
            </div>
        </div>
    );
};

export default Mypage;
