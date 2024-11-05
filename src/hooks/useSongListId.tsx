import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchSongListId = async () => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/songs/mylist`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
  if (response.data && response.data.length > 0) {
    return response.data[0].id;
  } else {
    throw new Error("No song list found");
  }
};

export const useSongListId = () => {
  return useQuery({
    queryKey: ["songListId"],
    queryFn: fetchSongListId,
    retry: false,
  });
};
