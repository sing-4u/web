import axios from "axios";
import React, { useEffect, useState } from "react";
import useUserData from "../hooks/useUserData";
import { Navigate, useNavigate } from "react-router-dom";
import CloseIcon from "../components/CloseIcon";
interface DeleteAccountModalProps {
  closeModal: () => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  closeModal,
}) => {
  const { data: userData } = useUserData();
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (userData?.email) {
      setEmail(userData.email);
    }
  }, [userData]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleDeleteAccount = async () => {
    if (!validateEmail(email)) {
      setErrorMessage("유효한 이메일 주소를 입력해주세요.");
      return;
    }

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        data: { email },
      });
      console.log("회원탈퇴 성공"); //TODO: 알림 팝업 화 작업 예정
      navigate("/");
      window.location.reload();
      closeModal();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setErrorMessage("이메일을 다시 확인해주세요.");
      } else {
        setErrorMessage("회원탈퇴에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white mobile:w-[327px] mobile:h-[556px] rounded-[8px] mobile:px-8 mobile:py-5 md:w-[460px] md:h-[642px] md:flex md:flex-col md:items-center md:justify-center">
        <div className="flex justify-between items-center w-full md:w-[380px] md:h-[29px] h-[21px] font-bold text-[18px] leading-[21.48px] p-0">
          회원 탈퇴
          <div className="cursor-pointer" onClick={closeModal}>
            <CloseIcon />
          </div>
        </div>
        <div className="h-2 w-full md:w-[279px]">
          {errorMessage && (
            <div className="text-red-500 text-sm p-2">{errorMessage}</div>
          )}
        </div>
        <div className="flex flex-col gap-2 mt-10 w-full md:w-[380px] md:h-[83px]">
          <label className="font-medium text-[14px] leading-[16.71px]">
            계정 이메일
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="w-full h-[52px] rounded-[10px] border border-inputBorderColor py-3.5 px-[18px] focus:outline-none focus:border-[1px] focus:border-black"
          ></input>
        </div>
        <div className="w-full md:w-[380px] md:h-[264px] min-h-[234px] rounded-[10px] border border-inputBorderColor py-3.5 px-4 mt-4 md:py-5">
          <div className="w-full md:w-[243px] h-[24px] font-bold text-[14px] md:text-[16px] leading-[24px]">
            탈퇴 시 유의사항
          </div>
          <ul className="flex flex-col list-disc ml-5 list-outside font-normal text-[12px] leading-[17px] md:text-[14px] md:leading-[22px] gap-y-2.5 mt-3">
            <li className="">
              탈퇴 시 회원정보는 Sing4U 개인정보처리방침에 따라 삭제 또는
              격리하여 보존 조치하게 되며, 삭제된 데이터는 복구가 불가능합니다.
            </li>
            <li className="">탈퇴 시 신청곡 게시물은 폐쇄됩니다.</li>
            <li className="">
              신청된 곡 정보는 탈퇴 후에도 삭제되지 않습니다.
            </li>
            <li className="">
              탈퇴 처리된 계정 이메일은 재 가입 방지를 위해 30일간 보존된 후
              삭제처리 됩니다.
            </li>
          </ul>
        </div>
        <div className="w-full md:w-[279px] h-[36px] font-normal text-[12px] leading-[18px] text-center mt-4 text-[#FF4242]">
          '회원탈퇴'를 누르는 것은 위 안내사항을 모두 확인하였으며, 이에
          동의함을 의미합니다.
        </div>
        <button
          onClick={handleDeleteAccount}
          className="w-full md:w-[380px] h-[52px] md:h-[56px] border bg-[#7846DD] text-white rounded-[10px] mt-5 text-[14px] leading-[16.71px] md:font-bold md:text-[16px] md:leading-[19.09px]"
        >
          탈퇴하기
        </button>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
