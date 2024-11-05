import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ImgProfileL from "../components/ImgProfileL";
import useUserData from "../hooks/useUserData";
import { useQueryClient } from "@tanstack/react-query";
import { useStartReceiving } from "../hooks/useStartReceiving";
import { useEndReceiving } from "../hooks/useEndReceiving";
import { useSongList } from "../hooks/useSongList";
import { useSongListId } from "../hooks/useSongListId";
import { set } from "react-hook-form";

const ManageSong = () => {
  const { data: userData } = useUserData();
  const profileImage = userData?.image;
  const nickname = userData?.name;
  const isReceivingOpen = userData?.isOpened;

  const [receivingSong, setReceivingSong] = useState(false);
  const [isaccodianOpen, setIsAccodianOpen] = useState(false);

  const startReceivingMutation = useStartReceiving();
  const endReceivingMutation = useEndReceiving();
  const { data: songList } = useSongList(receivingSong);
  const { data: songListId } = useSongListId();

  useEffect(() => {
    if (isReceivingOpen) {
      setReceivingSong(true);
    }
  }, [isReceivingOpen]);

  const handleStartReceiving = () => {
    startReceivingMutation.mutate(undefined, {
      onSuccess: () => {
        setReceivingSong(true);
      },
    });
  };

  const handleEndReceiving = () => {
    if (songListId) {
      endReceivingMutation.mutate(songListId, {
        onSuccess: () => {
          setReceivingSong(false);
        },
      });
    }
  };

  const smallButtonClass =
    "w-[160px] h-[44px] rounded-[4px] py-3.5 px-5 font-semibold text-[14px] leading-[16.71px]";

  return (
    <div className="w-full max-w-[376px] mx-auto flex flex-col items-center">
      <Navbar />
      <div className="relative w-[90px] h-[90px] mt-6">
        <div
          className={`absolute inset-0 p-[4px] rounded-full ${
            receivingSong
              ? "bg-gradient-to-r from-[#7B92C7] via-[#7846DD] to-[#BB7FA0]"
              : ""
          }`}
        >
          <div className="relative w-full h-full bg-white rounded-full overflow-hidden">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <ImgProfileL />
            )}
          </div>
        </div>
        {receivingSong && (
          <p
            className="absolute flex justify-center items-center bottom-[-10px] left-1/2 transform -translate-x-1/2
          w-[73px] h-[20px] rounded-[4px] py-1 px-2 font-semibold text-[10px] leading-[11.93px]
           bg-gradient-to-r from-[#7B92C7] via-[#7846DD] to-[#BB7FA0] text-white"
          >
            신청곡 받는 중
          </p>
        )}
      </div>
      <div className="mt-4 font-semibold text-[18px] leading-[21.48px]">
        {nickname}
      </div>
      <div className="flex flex-col items-center mt-4">
        <div className="flex space-x-2">
          <button
            onClick={handleStartReceiving}
            className={smallButtonClass + " bg-buttonColor2"}
          >
            신청곡 받기
          </button>
          <button
            onClick={handleEndReceiving}
            className={smallButtonClass + " bg-black text-white"}
          >
            신청곡 종료
          </button>
        </div>
        <div className="mt-3 w-[327px] h-[44px] rounded-[4px] py-3.5 px-5 text-center bg-colorPurple text-white font-semibold text-[14px] leading-[16.71px] cursor-pointer">
          <button>신청곡 링크 복사</button>
        </div>
      </div>
      {receivingSong && songList && (
        <div className="w-full mt-4">
          <div className="accordion">
            <div className="accordion-header">
              <h2>신청 곡 목록</h2>
            </div>
            <div className="accordion-content">
              <ul>
                {songList.map((song: { title: string }, index: number) => (
                  <li key={index}>
                    {index + 1}. {song.title}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSong;
