import React from "react";
import ImgProfileS from "./ImgProfileS";
import { useNavigate, Route } from "react-router-dom";
import useUserData from "../hooks/useUserData";
import Logo from "./Logo";

interface NavbarProps {
  profileImage?: string | File | null;
}

const Navbar: React.FC<NavbarProps> = ({ profileImage }) => {
  const navigate = useNavigate();

  const { data: userData, isLoading, error } = useUserData();

  const isLoggedIn = !!userData;
  const defaultProfileImage =
    typeof userData?.image === "string" ? userData.image : undefined;

  return (
    <div className="w-full border-b-[0.5px] border-inputBorderColor">
      <div className="flex justify-between items-center w-full h-[60px] max-w-6xl mx-auto px-6">
        <div
          onClick={() => navigate("/")}
          className="w-[64px] h-[22.5px] cursor-pointer"
        >
          <Logo />
        </div>
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <button
                onClick={() => navigate("/manage-song")}
                className="flex w-[79px] h-[30px] tablet:px-[21px] tablet:w-[106px] tablet:h-[44px] tablet:text-[14px] pc:w-[120px] pc:h-[44px] pc:px-[21px] pc:text-[16px] border rounded-[5px] py-4 px-2 font-bold text-[12px] leading-[14.32px] justify-center items-center bg-gradient-to-r from-[#7B92C7] via-[#7846DD] to-[#BB7FA0] text-white whitespace-nowrap"
              >
                신청곡 관리
              </button>
              <div className="w-[36px] h-[36px] tablet:w-[44px] tablet:h-[44px]  pc:w-[44px] pc:h-[44px] rounded-full border overflow-hidden">
                {profileImage || defaultProfileImage ? (
                  <img
                    onClick={() => navigate("/mypage")}
                    src={
                      typeof profileImage === "string"
                        ? profileImage
                        : defaultProfileImage
                    }
                    alt="Profile"
                    className="w-full h-full object-cover cursor-pointer"
                  />
                ) : (
                  <div
                    onClick={() => navigate("/mypage")}
                    className="cursor-pointer w-full h-full"
                  >
                    <ImgProfileS />
                  </div>
                )}
              </div>
            </>
          ) : (
            <button
              onClick={() => {
                navigate("/login");
              }}
              className="flex w-[56px] md:w-[88px] md:h-[44px] md:text-[16px] md:leading-[19.09px] h-[30px] border rounded-[5px] py-3 px-2 font-bold text-[12px] leading-[14.32px] gap-2 justify-center items-center bg-black text-white ml-auto"
            >
              로그인
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
