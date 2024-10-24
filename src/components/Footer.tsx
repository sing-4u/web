import React from "react";

const Footer = () => {
  return (
    <div className="w-full p-5">
      <div className="flex w-[149px] h-[14px] font-bold text-[12px] leading-[14.32px] text-customGray gap-2">
        개인정보 처리 방침
        <div className="w-[1px] h-[14px] border border-customGray opacity-30"></div>
        <div className="w[42px] h-[14px] font-normal text-[12px] leading-[14.32px]">
          이용약관
        </div>
      </div>
      <div className="w-[327px] h-[12px] font-normal text-[10px] leading-[11.93px] text-customGray">
        <div>Copyright 2024 Sing4U All rights reserved.</div>
      </div>
    </div>
  );
};

export default Footer;
