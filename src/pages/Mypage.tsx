import { useState } from "react";
import Navbar from "../components/Navbar";
import useUserData from "../hooks/useUserData";
import ImgProfileL from "../components/ImgProfileL";
import CameraImg from "../components/CameraImg";
import ChevronRightSmall from "../components/ChevronRightSmall";
import Footer from "../components/Footer";
import PasswordDialog from "../components/PasswordDialog";
import axios from "axios";

const Mypage = () => {
    const { data: userData } = useUserData();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const profileImage =
        typeof userData?.image === "string" ? userData.image : undefined;

    const inputLabelClass =
        "w-[328px] h-[17px] font-medium text-[14px] leading-[16.71px] text-black";
    const inputClass =
        "w-[328px] h-[52px] rounded-[10px] border border-inputBorderColor py-3.5 px-[18px] focus:outline-none focus:border-[1px] focus:border-black";
    const changeButtonClass =
        "absolute right-3 w-[61px] h-[30px] rounded-[5px] py-[8px] px-[20px] font-bold text-[12px] leading-[14.32px] bg-black text-[#FFFFFF]";

    const handlePasswordChange = () => {};

    const handleDeleteImage = async () => {
        const image = userData?.image;
        if (image !== null) {
            await axios.patch(`${import.meta.env}/users/me/image`, {
                image
            });
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center">
            <Navbar />
            <form className="flex flex-col items-center w-full max-w-md mt-2 flex-grow">
                <div className="flex flex-col w-[328px] h-[413px] gap-y-6">
                    <div className="relative flex flex-col w-full justify-center items-center">
                        <div className="relative w-[90px] h-[90px] cursor-pointer mt-3">
                            {profileImage ? (
                                <img
                                    src={profileImage}
                                    alt="Profile"
                                    className="w-full h-full object-cover rounded-full "
                                    onClick={handleDeleteImage}
                                />
                            ) : (
                                <ImgProfileL />
                            )}
                            <div className="absolute w-[24px] h-[24px] top-[66px] left-[66px] rounded-full border">
                                <CameraImg />
                            </div>
                        </div>
                        <div className="w-[90px] h-[16px] mt-1 font-medium text-[13px] leading-[15.51px] text-center cursor-pointer text-customGray">
                            이미지삭제
                        </div>
                    </div>
                    <div className="flex flex-col gap-y-2">
                        <label htmlFor="nickname" className={inputLabelClass}>
                            닉네임
                        </label>
                        <input
                            type="text"
                            id="nickname"
                            value={userData?.name || ""}
                            className={inputClass}
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
                            />
                            <button
                                type="button"
                                className={changeButtonClass}
                                onClick={handlePasswordChange}
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
                                onClick={() => setIsDialogOpen(true)}
                                type="button"
                                className={changeButtonClass}
                            >
                                변경
                            </button>
                        </div>
                        <div className="flex justify-center w-full mt-6">
                            <button className="w-[328px] h-[52px] rounded-[10px] py-3.5 px-[18px] font-bold text-[14px] leading-[16.71px] bg-gray-200 text-customGray">
                                로그아웃
                            </button>
                        </div>
                        <div className="flex w-[327px] h-[17px] justify-start items-center font-normal text-[14px] leading-[16.71px] text-customGray mt-4 cursor-pointer">
                            탈퇴하기
                            <ChevronRightSmall />
                        </div>
                    </div>
                </div>
            </form>
            <div className="">
                <Footer />
            </div>
            <PasswordDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
            />
        </div>
    );
};

export default Mypage;
