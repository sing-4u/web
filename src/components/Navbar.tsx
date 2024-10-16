import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import ImgProfileS from "./ImgProfileS";

interface UserData {
  id: string;
  name: string;
  email: string;
  image: string;
  isOpened: true;
  provider: "EMAIL" | string;
}

const Navbar = () => {
  const { data, isLoading, error } = useQuery<UserData>({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const response = await axios.get<UserData>(
          `${import.meta.env.VITE_API_URL}/users/me`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        return response.data;
      } catch (error) {
        throw new Error("유저 정보 가져오기 실패");
      }
    },
  });

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-4">
      <div className="flex justify-between items-center w-[375px] h-[60px] top-[44px] border-b-[0.5px] pt-[12px] pr-[24px] pl-[24px] pb-[24px]">
        <div className="w-[80px] h-[30px]">Logo</div>
        <div className="flex items-center w-[127px] h-[36px] gap-3">
          <button className="flex w-[79px] h-[30px] border rounded-[5px] py-3 px-2 font-bold text-[12px] leading-[14.32px] justify-center items-center bg-black text-white">
            신청곡 관리
          </button>
          <div className="w-[36px] h-[36px] rounded-full border overflow-hidden">
            <ImgProfileS />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
