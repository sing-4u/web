import { FC } from "react";
import { useSongListId } from "../hooks/useSongListId";
import ChevronDown from "./ChevronDown";
import ChevronUp from "./ChevronUp";
import formatDate from "../utils/formatDate";

interface PreviousSongListProps {
  list: { id: number; startDate: string; endDate: string | null };
  idx: number;
  openPreviousSongs: Record<number, boolean>;
  setOpenPreviousSongs: React.Dispatch<
    React.SetStateAction<Record<number, boolean>>
  >;
}

const PreviousSongList: FC<PreviousSongListProps> = ({
  list,
  idx,
  openPreviousSongs,
  setOpenPreviousSongs,
}) => {
  const { data: previousSongDetails } = useSongListId(list.id.toString());

  return (
    <div
      key={list.id}
      className="flex flex-col w-[327px] rounded-[8px] border-2 border-inputBorderClass p-4 mt-8"
    >
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() =>
          setOpenPreviousSongs((prev: Record<number, boolean>) => ({
            ...prev,
            [idx]: !prev[idx],
          }))
        }
      >
        <div>
          <h2 className="font-semibold text-[18px] leading-[21.48px] text-black">
            이전 신청곡 순위
          </h2>
          <p className=" font-medium text-[12px] leading-[14.32px] mt-1">
            {formatDate(list.startDate)} ~ {formatDate(list.endDate ?? "")}
          </p>
        </div>
        {openPreviousSongs[idx] ? <ChevronUp /> : <ChevronDown />}
      </div>
      {openPreviousSongs[idx] && (
        <ul className="mt-4">
          {previousSongDetails?.map(
            (
              song: { title: string; artist: string; count: number },
              index: number
            ) => (
              <li
                key={index}
                className="flex items-center gap-4 py-2 border-b last:border-none"
              >
                <div className="flex items-center justify-center w-[24px] h-[24px] rounded-[4px] bg-black text-white font-bold text-[12px]">
                  {index + 1}
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-[14px]">{song.title}</span>
                  <span className="font-medium text-[12px] text-customGray">
                    {song.artist}
                  </span>
                </div>
                <div className="font-semibold text-[14px] ml-auto">
                  {song.count}명
                </div>
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
};

export default PreviousSongList;
