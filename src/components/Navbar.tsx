import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import ImgProfileS from "./ImgProfileS";
import { useNavigate, Route } from "react-router-dom";
import useUserData from "../hooks/useUserData";
interface UserData {
  id: string;
  name: string;
  email: string;
  image: string;
  isOpened: true;
  provider: "EMAIL" | string;
}

const Navbar = () => {
  const navigate = useNavigate();

  const { data: userData, isLoading, error } = useUserData();

  const isLoggedIn = !!userData;
  const profileImage =
    typeof userData?.image === "string" ? userData.image : undefined;

  return (
    <div className="w-full max-w-[376px] mx-auto">
      <div className="flex justify-between items-center w-full h-[60px] border-b-[0.5px] border-inputBorderColor px-6">
        <div className="w-[80px] h-[30px]">Logo</div>
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <button className="flex w-[79px] h-[30px] border rounded-[5px] py-4 px-2 font-bold text-[12px] leading-[14.32px] justify-center items-center bg-black text-white">
                신청곡 관리
              </button>
              <div className="w-[36px] h-[36px] rounded-full border overflow-hidden">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImgProfileS />
                )}
              </div>
            </>
          ) : (
            <button
              onClick={() => {
                navigate("/Login");
              }}
              className="flex w-[56px] h-[30px] border rounded-[5px] py-3 px-2 font-bold text-[12px] leading-[14.32px] gap-2 justify-center items-center bg-black text-white ml-auto"
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