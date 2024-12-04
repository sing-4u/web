import React from "react";
import ImgProfileS from "./ImgProfileS";
import { useNavigate, Route } from "react-router-dom";
import useUserData from "../hooks/useUserData";
import Logo from "./Logo";

interface NavbarProps {
    profileImage?: string | File | null;
}

const NavbarWithoutLoginButton: React.FC<NavbarProps> = () => {
    const navigate = useNavigate();

    return (
        <div className="w-full">
            <div className="flex justify-between items-center w-full h-[60px] max-w-6xl mx-auto px-6">
                <div
                    onClick={() => navigate("/")}
                    className="w-[64px] h-[22.5px] cursor-pointer"
                >
                    <Logo />
                </div>
            </div>
        </div>
    );
};

export default NavbarWithoutLoginButton;
