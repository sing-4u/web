import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchSongList = async () => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/songs/mylist`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
  return response.data;
};

export const useSongList = (enabled: boolean) => {
  return useQuery({
    queryKey: ["songList"],
    queryFn: fetchSongList,
    enabled: enabled,
  });
};
