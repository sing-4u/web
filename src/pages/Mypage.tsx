import React, { useState, useEffect, ChangeEvent } from "react";

interface UserData {
  id: string;
  name: string;
  email: string;
  image: string;
  isOpened: true;
  provider: "EMAIL" | string;
}

const Mypage = () => {
  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-4">
      <div className="flex justify-between w-[375px] h-[60px] top-[44px] border-b-[0.5px] pt-[12px] pr-[24px] pl-[24px] pb-[24px]">
        <div className="w-[80px] h-[30px]">Logo</div>
        <div className="flex w-[127px] h-[13px] gap-3">
          <button className="flex w-[79px] h-[30px] border rounded-[5px] py-3 px-2 font-bold text-[12px] leading-[14.32px] justify-center items-center bg-black text-white">
            신청곡 관리
          </button>
          <div className="w-[36px] h-[36px] rounded-full border">1</div>
        </div>
      </div>
    </div>
  );
};

export default Mypage;
