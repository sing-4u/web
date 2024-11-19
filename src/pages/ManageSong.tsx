import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ImgProfileL from "../components/ImgProfileL";
import useUserData from "../hooks/useUserData";
import { useQueryClient } from "@tanstack/react-query";
import { useStartReceiving } from "../hooks/useStartReceiving";
import { useEndReceiving } from "../hooks/useEndReceiving";
import { useSongList } from "../hooks/useSongList";
import { useSongListId } from "../hooks/useSongListId";
import formatDate from "../utils/formatDate";
import ChevronDown from "../components/ChevronDown";
import ChevronUp from "../components/ChevronUp";
import axiosInstance from "../utils/axiosInstance";
import PreviousSongList from "../components/PreviousSong";
import PullToRefreshComponent from "../components/PullToRefresh";
import { NonListNow, NonListPrevious } from "../components/NonListMessage";

const ManageSong = () => {
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState("");
  const { data: userData } = useUserData();
  const profileImage = userData?.image;
  const nickname = userData?.name;
  const isReceivingOpen = userData?.isOpened;

  const [receivingSong, setReceivingSong] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);
  const [visibleSongs, setVisibleSongs] = useState(5);

  const [openPreviousSongs, setOpenPreviousSongs] = useState<{
    [key: number]: boolean;
  }>({});

  useEffect(() => {
    async function fetchRequestForm() {
      const data = await axiosInstance().get(`/users/form/${userData?.id}`);

      setUserId(data.data.id);
    }
    fetchRequestForm();
  }, [userData?.id]);

  const startReceivingMutation = useStartReceiving();
  const endReceivingMutation = useEndReceiving();
  const { data: songList } = useSongList(true);
  const songListId = songList?.[0]?.id;
  const { data: songListDetails } = useSongListId(songListId);

  useEffect(() => {
    if (isReceivingOpen) {
      setReceivingSong(true);
    }
  }, [isReceivingOpen]);

  const handleStartReceiving = () => {
    startReceivingMutation.mutate(undefined, {
      onSuccess: () => {
        setReceivingSong(true);
        queryClient.invalidateQueries({ queryKey: ["songList"] });
        queryClient.invalidateQueries({ queryKey: ["songListId"] });
      },
    });
  };

  const handleEndReceiving = () => {
    if (songListId) {
      endReceivingMutation.mutate(songListId, {
        onSuccess: () => {
          setReceivingSong(false);

          queryClient.invalidateQueries({ queryKey: ["songList"] });
          queryClient.invalidateQueries({ queryKey: ["songListId"] });
        },
      });
    }
  };

  const nowSongList = Array.isArray(songList) ? songList[0] : null;
  const previousSongLists =
    songList?.filter(
      (list: { endDate: string | null }) => list.endDate !== null
    ) || [];

  const handleCopyUrl = () => {
    const baseUrl = window.location.origin;
    const requestUrl = `${baseUrl}/song-detail?formId=${userId}`;

    navigator.clipboard
      .writeText(requestUrl)
      .then(() => {
        console.log("복사 완료");
      })
      .catch((error) => {
        console.error("복사 실패: ", error);
      });
  };

  const handleRefresh = async () => {
    try {
      await queryClient.invalidateQueries({
        queryKey: ["userData", "songList", "songListId"],
      });
      console.log("새로고침 완료");
    } catch (error) {
      console.error("새로고침 중 오류 발생:", error);
    }
  };

  const handleShowMoreSongs = () => {
    setVisibleSongs((prev) => prev + 5);
  };

  const smallButtonClass =
    "w-[160px] h-[44px] rounded-[4px] py-3.5 px-5 font-semibold text-[14px] leading-[16.71px]";

  return (
    <PullToRefreshComponent onRefresh={handleRefresh}>
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
           bg-gradient-to-r from-[#7B92C7] via-[#3f384d] to-[#BB7FA0] text-white"
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
          <div className="relative mt-3 w-[327px] h-[44px] rounded-[4px] py-3.5 px-5 text-center bg-colorPurple text-white font-semibold text-[14px] leading-[16.71px] cursor-pointer">
            <button
              onClick={handleCopyUrl}
              className="absolute inset-0 w-full h-full"
            >
              신청곡 링크 복사
            </button>
          </div>
        </div>
        {receivingSong && nowSongList ? (
          <div className="flex flex-col w-[327px] rounded-[8px] border-2 border-indigo-500/50 p-4 mt-8">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setIsAccordionOpen(!isAccordionOpen)}
            >
              <h2 className="inline-block text-transparent bg-clip-text font-semibold text-[18px] leading-[21.48px] bg-gradient-to-r from-[#7B92C7] via-[#7846DD] to-[#BB7FA0]">
                현재 신청 곡 순위
              </h2>
              {isAccordionOpen ? <ChevronUp /> : <ChevronDown />}
            </div>

            <p className="font-medium text-[12px] leading-[14.32px] text-black mt-1">
              {formatDate(nowSongList.startDate) + "부터 신청 곡 받고 있어요"}
            </p>

            {isAccordionOpen && (
              <div>
                <ul className="mt-4">
                  {songListDetails?.slice(0, visibleSongs)?.map(
                    (
                      song: {
                        title: string;
                        artist: string;
                        count: number;
                      },
                      index: number
                    ) => (
                      <li
                        className="flex items-center gap-4 py-2 border-b last:border-none"
                        key={index}
                      >
                        <div className="flex items-center justify-center w-[24px] h-[24px] rounded-[4px] bg-[#7846dd] text-white font-bold text-[12px] leading-[14.32px] text-center">
                          {index + 1}
                        </div>

                        <div className="flex flex-col">
                          <span className="font-medium text-[14px] leading-[16.71px text-black]">
                            {song.title}
                          </span>
                          <span className="font-medium text-[12px] leading-[14.32px] text-customGray">
                            {song.artist}
                          </span>
                        </div>

                        <div className="font-semibold text-[14px] leading-[16.71px] ml-auto">
                          {song.count}명
                        </div>
                      </li>
                    )
                  )}
                </ul>
                <button
                  onClick={handleShowMoreSongs}
                  className="mt-4 px-4 py-4 w-full h-[14px] font-semibold text-[12px] leading-[14.32px] border-t-2 border-inputBorderClass"
                >
                  더보기 +
                </button>
              </div>
            )}
          </div>
        ) : (
          <NonListNow />
        )}
        {previousSongLists?.length > 0 ? (
          <div className="w-[327px] mt-4 flex flex-col justify-center items-center mb-10">
            {previousSongLists.map(
              (
                list: {
                  id: number;
                  startDate: string;
                  endDate: string | null;
                },
                idx: number
              ) => (
                <PreviousSongList
                  key={list.id.toString()}
                  list={list}
                  idx={idx}
                  openPreviousSongs={openPreviousSongs}
                  setOpenPreviousSongs={setOpenPreviousSongs}
                />
              )
            )}
          </div>
        ) : (
          <NonListPrevious />
        )}
      </div>
    </PullToRefreshComponent>
  );
};

export default ManageSong;
