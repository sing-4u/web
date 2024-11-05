import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const startReceiving = async () => {
  await axios.post(
    `${import.meta.env.VITE_API_URL}/songs/open`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
};

export const useStartReceiving = () => {
  return useMutation<void, Error, void>({ mutationFn: startReceiving });
};
