import React, { useState } from "react";
import axios from "axios";

interface NicknameEditorProps {
    nickname: string;
    setNickname: (nickname: string) => void;
    onError: (message: string) => void;
}

const NicknameEditor: React.FC<NicknameEditorProps> = ({
    nickname,
    setNickname,
    onError
}) => {
    const [isEditing, setIsEditing] = useState(false);

    const handleNameChange = async () => {
        if (isEditing) {
            try {
                await axios.patch(
                    `${import.meta.env.VITE_API_URL}/users/me/name`,
                    { name: nickname },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "accessToken"
                            )}`
                        }
                    }
                );
                setIsEditing(false);
            } catch {
                onError("닉네임 변경에 실패했습니다. 다시 시도해주세요.");
            }
        } else {
            setIsEditing(true);
            setNickname("");
        }
    };

    const inputLabelClass =
        "w-[328px] h-[17px] font-medium text-[14px] leading-[16.71px] text-black";
    const inputClass =
        "w-[328px] h-[52px] rounded-[10px] border border-inputBorderColor py-3.5 px-[18px] focus:outline-none focus:border-[1px] focus:border-black";
    const changeButtonClass =
        "bg-customGray absolute right-3 w-[61px] h-[30px] rounded-[5px] py-[8px] px-[20px] font-bold text-[12px] leading-[14.32px] bg-black text-[#FFFFFF]";

    return (
        <div className="flex flex-col gap-y-2">
            <label htmlFor="nickname" className={inputLabelClass}>
                닉네임
            </label>
            <div className="relative flex items-center">
                <input
                    type="text"
                    id="nickname"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    disabled={!isEditing}
                    className={inputClass}
                />
                <button
                    type="button"
                    className={`${changeButtonClass} ${
                        isEditing ? "bg-gray-800" : "bg-customGray"
                    }`}
                    onClick={handleNameChange}
                >
                    {isEditing ? "완료" : "수정"}
                </button>
            </div>
        </div>
    );
};

export default NicknameEditor;
