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
        <footer className="w-full bg-white border-t border-[#E5E5E5] fixed bottom-0 left-0">
            <div className="pc:px-[191px] pc:py-[13.5px] tablet:py-[13.5px] tablet:px-12 tablet:flex-row mobile:px-6 mobile:py-4 mobile:flex-col mobile:justify-center mobile:items-start mobile:w-full flex justify-between items-center">
                <div className="flex mobile:mb-2 space-x-3">
                    <button
                        onClick={handlePrivacyClick}
                        className="mobile:text-xs tablet:text-[11px] pc:text-[11px] font-bold text-[#666666] h-[14px]"
                    >
                        개인정보 처리 방침
                    </button>
                    <div className="w-[1px] h-3 bg-[#E5E5E5]"></div>
                    <button
                        onClick={handleTermsClick}
                        className="mobile:text-xs tablet:text-[11px] pc:text-[11px] font-normal text-[#666666] h-[14px]"
                    >
                        이용약관
                    </button>
                    <div className="w-[1px] h-3 bg-[#E5E5E5]"></div>
                    <button
                        onClick={handleInquiryClick}
                        className="mobile:text-xs tablet:text-[11px] pc:text-[11px] font-normal text-[#666666] h-[14px]"
                    >
                        문의
                    </button>
                </div>
                <div className="text-xs text-[#666666]">
                    Copyright 2024 Sing4U All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
