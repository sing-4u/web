import React from "react";

const handleInquiryClick = () => {
    window.open(
        "https://forms.gle/ZinP7Qm3UAdegs246",
        "_blank",
        "noopener,noreferrer"
    );
};

const handlePrivacyClick = () => {
    window.open(
        "https://bronze-reaction-5e0.notion.site/112cba65465f80ab8588f91a4f65a458?pvs=4",
        "_blank",
        "noopener,noreferrer"
    );
};

const handleTermsClick = () => {
    window.open(
        "https://bronze-reaction-5e0.notion.site/112cba65465f80248052d4e4a5eee135?pvs=4",
        "_blank",
        "noopener,noreferrer"
    );
};

const Footer = () => {
    return (
        <div className="w-full bg-white mobile:min-w-[375px] min-h-[40px] md:flex md:justify-center mobile:flex mobile:flex-col mobile:justify-center mobile:items-center tablet:flex tablet:justify-between tablet:items-center lg:w-full pc:w-[1440px] pc:h-[40px] pc:items-center pc:justify-between fixed bottom-0">
            <div className="flex mx-auto w-[200px] h-[14px] font-bold text-[12px] leading-[14.32px] text-customGray gap-2 ">
                <div
                    onClick={handlePrivacyClick}
                    className="w[42px] h-[14px] cursor-pointer font-bold text-[12px] leading-[14.32px] md:text-[11px] md:leading-[13.13px]"
                >
                    개인정보 처리 방침
                </div>

                <div className="w-[1px] h-[14px] border border-customGray opacity-30"></div>
                <div
                    onClick={handleTermsClick}
                    className="w[42px] h-[14px] cursor-pointer font-normal text-[12px] leading-[14.32px] md:text-[11px] md:leading-[13.13px]"
                >
                    이용약관
                </div>
                <div className="w-[1px] h-[14px] border border-customGray opacity-30"></div>
                <div
                    onClick={handleInquiryClick}
                    className="w[42px] h-[14px] cursor-pointer font-normal text-[12px] leading-[14.32px] md:text-[11px] md:leading-[13.13px]"
                >
                    문의
                </div>
            </div>
            <div className="w-[327px] lg:w-[230px] lg:text-[10px] lg:leading-[11.93px] h-[12px] pr-2.5 mx-auto text-center font-normal text-[10px] leading-[11.93px] text-customGray md:w-[230px] md:h-[12px] md:text-[10px] md:leading-[11.93px]">
                <div>Copyright 2024 Sing4U All rights reserved.</div>
            </div>
        </div>
    );
};

export default Footer;
