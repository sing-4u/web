import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchSongListId = async (songListId: string) => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/songs/mylist/${songListId}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
  return response.data;
};

export const useSongListId = (songListId: string) => {
  return useQuery({
    queryKey: ["songListId", songListId],
    queryFn: () => fetchSongListId(songListId),
    retry: false,
  });
};
