import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const endReceiving = async (songListId: string) => {
  await axios.post(
    `${import.meta.env.VITE_API_URL}/songs/close`,
    { songListId },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
};

export const useEndReceiving = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (songListId) => endReceiving(songListId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["songs"] });
    },
  });
};
