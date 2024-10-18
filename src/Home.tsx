import SearchIcon from "../src/assets/ic_Search.svg";
import Card from "../src/assets/card.svg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    const handleLogin = () => {
        setIsLoggedIn(!isLoggedIn);
    };

    // const handleLogout = () => {
    //     setIsLoggedIn(false);
    // };

    // const handleArtistClick = (index) => {
    //     if (isLoggedIn) {
    //         console.log(`Navigate to artist ${index + 1}`);
    //         // Navigation would be handled here in a real app
    //     } else {
    //         handleLogin();
    //     }
    // };

    const handleMypageClick = () => {
        navigate("/mypage");
    };

    return (
        <div className="w-full max-w-md mx-auto p-6 space-y-4">
            <div className="flex justify-between">
                <img src={Card} alt="" className="w-auto h-4" />
                {/* <img src={Card} alt="" className="w-4 h-4" /> */}
                {isLoggedIn ? (
                    <div className="flex items-center space-x-2">
                        <button className="bg-black text-white text-sm py-1 px-3 rounded-md">
                            신청곡 관리
                        </button>
                        <img
                            src={Card}
                            className="w-8 h-8 bg-gray-200 rounded-full cursor-pointer"
                            onClick={handleMypageClick}
                        />
                    </div>
                ) : (
                    <button
                        className="bg-black text-white text-sm py-1 px-3 rounded-md"
                        onClick={handleLogin}
                    >
                        로그인
                    </button>
                )}
            </div>
            <div className="relative">
                <input
                    type="text"
                    placeholder="아티스트명을 검색해주세요"
                    className="w-full border p-2 pl-10 rounded-[10px]"
                />
                <img
                    src={SearchIcon}
                    alt="Search Icon"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                {Array(10)
                    .fill(0)
                    .map((_, index) => (
                        <div className="flex flex-col justify-center">
                            <img
                                key={index}
                                src={Card}
                                alt={`Card ${index + 1}`}
                                className="w-full h-auto hover:cursor-pointer"
                            />
                            <span className="mt-2 text-center font-bold">
                                아이유
                            </span>
                        </div>
                    ))}
            </div>

            <div className="space-y-2 font-Pretendard"></div>
            <button
                className="w-full bg-black text-white rounded-[10px] h-[52px] font-Pretendard"
                type="submit"
            ></button>
        </div>
    );
}
