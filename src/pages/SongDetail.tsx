import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import useUserData from "../hooks/useUserData";
import ImgProfileL from "../components/ImgProfileL";
import TriangleFillRed from "../assets/ic_TriangleFill_red.svg";
import { useForm } from "react-hook-form";
import axiosInstance from "../utils/axiosInstance";
import getInputErrorClassName from "../utils/className";
import { useModal } from "../hooks/useModal";
import axios from "axios";
import SongRequestFailModal from "../components/Modal/SongRequestFailModal";
import SongRequestSuccessModal from "../components/Modal/SongRequestSuccessModal";
import EmailInputModal from "../components/Modal/EmailInputModal";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ModalType } from "../types";
import { useTitle } from "../hooks/useTitle";
import Footer from "../components/Footer";
import MypageProfile from "../components/MypageProfileL";
import ImgProfile from "../assets/ImageProfileL.svg";

interface SongDetailForm {
  artist: string;
  title: string;
}

interface User {
  id: string;
  name: string;
  image: string | null;
  isOpened: boolean;
}

const SongDetail = () => {
  const location = useLocation();
  const user = location.state as { user: User };
  const [fetchedUser, setFetchedUser] = useState<User | null>(null);

  const setTitle = useTitle();

  setTimeout(() => {
    setTitle("신청곡 상세");
  }, 100);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const formId = searchParams.get("formId");
  const { data: userData } = useUserData();
  const profileImage = user?.user?.image || fetchedUser?.image;

  const { openModal, closeModal } = useModal();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SongDetailForm>();

  const resetFields = () => {
    setValue("artist", "");
    setValue("title", "");
  };

  // const isLoggedIn = !!userData;

  useEffect(() => {
    async function fetchRequestForm() {
      if (typeof formId === "string") {
        if (formId) {
          try {
            const { data } = await axiosInstance().get(`/users/form/${formId}`);

            setFetchedUser(data);
          } catch {
            throw new Error("Failed to fetch user form");
          }
        }
      }
    }
    fetchRequestForm();
  }, [formId]);

  const onSubmit = async ({ artist, title }: SongDetailForm) => {
    const { email } = userData ?? { email: "" };

    try {
      const res = await axiosInstance().post("/songs", {
        userId: formId,
        email,
        artist,
        title,
      });
      if (res.status === 201) {
        openModal({
          title: "신청 완료",
          type: ModalType.SUCCESS,
          Content: SongRequestSuccessModal,
          data: { artist, title, formId, email },
          buttonBackgroundColor:
            "bg-gradient-to-r from-[#7B92C7] via-[#7846DD] to-[#BB7FA0] text-white whitespace-nowrap",
          onClose: resetFields,
        });
        resetFields();
      }
    } catch (error) {
      if (error instanceof Error) {
        if (axios.isAxiosError(error) && error.response?.status === 409) {
          const { detail } = error.response.data;
          openModal({
            title: "중복 신청",
            type: ModalType.ERROR,
            Content: SongRequestFailModal,
            data: {
              existingRequest: {
                artist: detail.artist,
                title: detail.title,
                email: detail.email,
              },
            },
            buttonBackgroundColor:
              "bg-gradient-to-br from-[#7B92C7] via-[#7846DD] to-[#BB7FA0]",
            onClose: resetFields,
          });
          resetFields();
        } else if (
          axios.isAxiosError(error) &&
          error.response?.status === 400
        ) {
          openModal({
            Content: (props) => (
              <EmailInputModal
                {...props}
                navigate={navigate}
                modalData={{ artist, title, formId, userData }}
                onRequestComplete={resetFields}
              />
            ),
            title: "싱포유 회원이시면",
            type: ModalType.NOTLOGIN,
            buttonBackgroundColor: "",
            onClose: () => {
              window.history.back();
            },
          });
          const handlePopState = () => {
            closeModal();
          };
          window.addEventListener("popstate", handlePopState);

          // Cleanup listener when modal closes
          const cleanup = () => {
            window.removeEventListener("popstate", handlePopState);
            resetFields();
          };

          return cleanup;
          resetFields();
        }
      }
    }
  };
  const userName = user?.user?.name || fetchedUser?.name;

  const inputLabelClass =
    "w-[328px] h-[17px] font-medium text-[14px] leading-[16.71px] text-black mb-2";
  const inputClass =
    "w-[328px] h-[52px] rounded-[10px] border border-inputBorderColor py-3.5 px-[18px] focus:outline-none focus:border-[1px] focus:border-black md:w-[380px]";

  const isOpened = user?.user?.isOpened || fetchedUser?.isOpened;

  const isButtonDisabled = !watch("artist") || !watch("title");

  return (
    <div className="w-full space-y-4">
      <Navbar />
      {isOpened ? (
        <div className="relative flex flex-col w-full justify-center items-center mt-[22px]">
          <div className="relative w-[90px] h-[90px] cursor-pointer mt-3">
            <img
              src={profileImage || ImgProfile}
              alt="Profile"
              className="w-full h-full object-cover rounded-full "
            />
          </div>
          <input
            type="file"
            id="profileImageInput"
            accept="image/*"
            className="hidden"
          />

          <span className="font-bold text-lg mt-4">
            {userName || "Loading...."}
          </span>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col mt-[22px]"
          >
            <div className="flex flex-col gap-1">
              <label htmlFor="가수" className={inputLabelClass}>
                가수
              </label>
              <input
                type="text"
                placeholder="가수 이름"
                className={`${inputClass} ${
                  errors.artist
                    ? "mb-2 border-errorTextColor"
                    : "mb-[22px] border-customGray"
                }`}
                {...register("artist", {
                  required: "가수 이름을 입력해주세요.",
                })}
              />
              {errors.artist && (
                <span className="text-red-500 text-sm mb-[22px]">
                  {errors.artist.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="노래 제목" className={inputLabelClass}>
                노래 제목
              </label>
              <input
                type="text"
                placeholder="노래 제목"
                className={`${inputClass} ${errors.title ? "mb-2" : ""}`}
                {...register("title", {
                  required: "노래 제목을 입력해주세요.",
                })}
              />
              {errors.title && (
                <span className="text-red-500 text-sm">
                  {errors.title.message}
                </span>
              )}
            </div>
            <div className="flex justify-center items-center gap-2 my-[22px]">
              <img src={TriangleFillRed} alt="warning" />
              <span className="font-pretendard text-sm">
                제출 후 수정이 불가능합니다.
              </span>
            </div>
            <button
              className={`
        flex items-center justify-center gap-2
        ${
          isButtonDisabled
            ? "bg-gray-300"
            : "bg-gradient-to-br from-[#7B92C7] via-[#7846DD] to-[#BB7FA0]"
        }
        text-white px-4 py-3 rounded-lg
        hover:opacity-90
        transition-opacity
    `}
            >
              신청곡 보내기
            </button>
          </form>
        </div>
      ) : (
        <div className="relative flex flex-col w-full justify-center items-center mt-10">
          <div className="relative w-[90px] h-[90px] cursor-pointer mt-3">
            {profileImage ? (
              typeof profileImage === "string" ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <img
                  src={URL.createObjectURL(profileImage)}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full "
                />
              )
            ) : (
              <MypageProfile />
            )}
          </div>
          <input
            type="file"
            id="profileImageInput"
            accept="image/*"
            className="hidden"
          />
          <span className="font-bold text-lg mt-4">
            {userName || "Loading...."}
          </span>

          <section className="w-[379px] h-[136px] bg-[#f5f5f5] mt-[38px] flex justify-center items-center text-center rounded-lg">
            현재 아티스트가 신청곡을 받고 있지 않습니다. <br />
            다음 신청 기간을 기다려 주세요.
          </section>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default SongDetail;
