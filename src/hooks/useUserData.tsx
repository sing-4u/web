import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface UserData {
    id: string;
    name: string;
    email: string;
    image: string;
    isOpened: true;
    provider: "EMAIL" | string;
}

const useUserData = () => {
    const accessToken = localStorage.getItem("accessToken");
    return useQuery<UserData>({
        queryKey: ["user"],
        queryFn: async () => {
            try {
                const response = await axios.get<UserData>(
                    `${import.meta.env.VITE_API_URL}/users/me`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "accessToken"
                            )}`
                        }
                    }
                );
                return response.data;
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    if (error.response?.status === 400) {
                        console.error("유효성 검사 실패");
                    } else if (error.response?.status === 401) {
                        console.error("인증 실패");
                    }
                }
                console.error("유저 정보 가져오기 실패");
                throw error;
            }
        },
        enabled: Boolean(accessToken)
    });
};

export default useUserData;
