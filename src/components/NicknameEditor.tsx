import React, { useState } from "react";
import axios from "axios";
import { ToastContainer } from "./ToastContainer";

interface NicknameEditorProps {
  nickname: string;
  setNickname: (nickname: string) => void;
  onError: (message: string) => void;
  clearErrors: () => void;
}

const NicknameEditor: React.FC<NicknameEditorProps> = ({
  nickname,
  setNickname,
  onError,
  clearErrors,
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
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        setIsEditing(false);
        clearErrors();
      } catch {
        onError("닉네임을 입력해 주세요.");
      }
    } else {
      setIsEditing(true);
      setNickname("");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleNameChange();
    }
  };

  const inputLabelClass =
    "w-[328px] h-[17px] font-medium text-[14px] leading-[16.71px] text-black";
  const inputClass =
    "w-[328px] h-[52px] rounded-[10px] border border-inputBorderColor py-3.5 px-[18px] focus:outline-none focus:border-[1px] focus:border-black md:w-[380px]";

  const changeButtonClass =
    "absolute right-3 w-[61px] h-[30px] rounded-[5px] py-[8px] px-[20px] font-bold text-[12px] leading-[14.32px] bg-black text-[#FFFFFF] md:right-4 md:w-[70px] md:h-[35px] md:text-[14px]";
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
          onChange={(e) => {
            setNickname(e.target.value);
            clearErrors();
          }}
          onKeyDown={handleKeyDown}
          disabled={!isEditing}
          className={inputClass}
        />
        <button
          type="button"
          className={`${changeButtonClass} ${
            isEditing ? " bg-customGray" : "bg-black"
          } whitespace-nowrap`}
          onClick={handleNameChange}
        >
          {isEditing ? "완료" : "수정"}
        </button>
      </div>
    </div>
  );
};

export default NicknameEditor;
