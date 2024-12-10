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
import { NonListNow, NonListPrevious } from "../components/NonListMessage";
import { WaitingSongMessage } from "../components/NonListMessage";
import Footer from "../components/Footer";

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
  const [isCopied, setIsCopied] = useState(false);
  const [openPreviousSongs, setOpenPreviousSongs] = useState<{
    [key: number]: boolean;
  }>({});

  useEffect(() => {
    async function fetchRequestForm() {
      const data = await axiosInstance().get(`/users/form/${userData?.id}`);
      setUserId(data?.data?.id);
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

  useEffect(() => {
    const updateVisibleSongs = () => {
      setVisibleSongs(window.innerWidth >= 1445 ? 10 : 5);
    };

    updateVisibleSongs();
    window.addEventListener("resize", updateVisibleSongs);

    return () => {
      window.removeEventListener("resize", updateVisibleSongs);
    };
  }, []);

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

    navigator.clipboard.writeText(requestUrl).then(() => {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 1000);
    });
  };

  const handleShowMoreSongs = () => {
    setVisibleSongs((prev) => prev + 5);
  };

  const handleFeedBackClick = () => {
    window.open(
      "https://forms.gle/a2PgcpA7De8UxQp17",
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleAccordionToggle = () => {
    setIsAccordionOpen((prev) => !prev);
    if (!isAccordionOpen) {
      setVisibleSongs(window.innerWidth >= 1450 ? 10 : 5);
    }
  };

  const smallButtonClass =
    "w-[160px] h-[44px] rounded-[4px] py-3.5 px-5 font-semibold text-[14px] leading-[16.71px]";
  const commentButtonClass =
    "mobile:w-[72px] mobile:h-[72px] mobile:py-[26px] mobile:px-[10px] mobile:text-[10px] mobile:font-semibold mobile:leading-[11.93px] bg-black text-white rounded-full flex items-center justify-center text-base hover:bg-gray-800 transition-colors";
  return (
    <div className="mobile:w-[375px] mx-auto flex flex-col items-center tablet:w-full pc:w-full">
      <Navbar />
      <div className="pc:w-full pc:max-w-6xl pc:flex pc:ml-14">
        <div className="flex flex-col justify-center items-center tablet:flex-row tablet:justify-between tablet:w-[672px] tablet:border tablet:border-inputBorderColor tablet:rounded-[8px] tablet:p-4 tablet:mt-10 mobile:mt-4 pc:w-[270ox] pc:h-[328px] pc:border-2 pc:border-inputBorderColor pc:rounded pc:mt-10 pc:p-4">
          <div className="flex flex-col tablet:mt-0 items-center tablet:flex-row">
            <div className="pc:mb-10 tablet:flex tablet:items-center">
              <div className="relative w-[90px] h-[90px]">
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
         bg-gradient-to-r from-[#7B92C7] via-[#3f384d] to-[#BB7FA0] text-white whitespace-nowrap"
                  >
                    신청곡 받는 중
                  </p>
                )}
              </div>
              <div className="font-semibold text-[18px] leading-[21.48px] mobile:mt-3 mobile:text-center tablet:mt-0 tablet:ml-4 pc:text-center pc:mt-4">
                {nickname}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center mobile:mt-6 tablet:mt-0">
            <div className="flex space-x-2">
              <button
                onClick={handleStartReceiving}
                className={`${smallButtonClass} ${
                  receivingSong ? "bg-buttonColor2" : "bg-black text-white"
                }`}
              >
                신청곡 받기
              </button>
              <button
                onClick={handleEndReceiving}
                className={`${smallButtonClass} ${
                  receivingSong ? "bg-black text-white" : "bg-buttonColor2"
                }`}
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
            {isCopied && (
              <div className="fixed inset-0 z-10 flex justify-center items-center mobile:bg-[#000000] mobile:bg-opacity-40 transition-opacity animate-fadeOut">
                <div className="bg-[#ffffff] py-6 px-12 mobile:py-4 mobile:px-10 rounded-sm border-2 shadow-2xl font-semibold text-[18px] leading-[21.48px] text-center  mobile:text-[18px]">
                  링크 복사 완료!
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="tablet:flex tablet:flex-1 pc:flex pc:gap-x-8 pc:mt-4 tablet:space-x-2 tablet:ml-0">
          <div className="pc:ml-10">
            {receivingSong && nowSongList ? (
              <div className="flex flex-col w-[327px] rounded-[8px] border-2 border-indigo-500/50 p-4 mt-6">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={handleAccordionToggle}
                >
                  <h2 className="inline-block text-transparent bg-clip-text font-semibold text-[18px] leading-[21.48px] bg-gradient-to-r from-[#7B92C7] via-[#7846DD] to-[#BB7FA0]">
                    현재 신청 곡 순위
                  </h2>
                  {isAccordionOpen ? <ChevronUp /> : <ChevronDown />}
                </div>

                <p className="font-medium text-[12px] leading-[14.32px] text-black">
                  {formatDate(nowSongList.startDate) +
                    "부터 신청 곡 받고 있어요"}
                </p>

                {isAccordionOpen && (
                  <div>
                    {songListDetails && songListDetails.length > 0 ? (
                      <div>
                        <ul className="mt-4">
                          {songListDetails.slice(0, visibleSongs).map(
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
                        {songListDetails.length > visibleSongs && (
                          <button
                            onClick={handleShowMoreSongs}
                            className="mt-5 px-4 py-4 w-full h-[14px] font-semibold text-[12px] leading-[14.32px] border-t-2 border-inputBorderClass"
                          >
                            더보기 +
                          </button>
                        )}
                      </div>
                    ) : (
                      <WaitingSongMessage />
                    )}
                  </div>
                )}
              </div>
            ) : (
              <NonListNow />
            )}
          </div>
          <div className="tablet:flex tablet:flex-1 mobile:ml-0 tablet:ml-4">
            {previousSongLists?.length > 0 ? (
              <div className="w-[327px] mobile:mt-4 tablet:mt-0 flex flex-col justify-center items-center mb-10">
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
          <div className="mobile:bg-white mobile:w-full mobile:h-[100px]"></div>
        </div>
      </div>
      <div className="w-full">
        <div className="fixed bottom-8 right-8 z-50">
          <button
            onClick={handleFeedBackClick}
            className={`${commentButtonClass} w-[110px] h-[110px] bg-black text-white rounded-full flex items-center justify-center text-base hover:bg-gray-800 transition-colors`}
          >
            의견 보내기
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ManageSong;
