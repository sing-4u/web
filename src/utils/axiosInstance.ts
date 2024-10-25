import axios from "axios";

const axiosInstance = (accessToken?: string) =>
    axios.create({
        baseURL: import.meta.env.VITE_API_URL,
        headers: {
            Authorization: accessToken
                ? `Bearer ${accessToken}`
                : `Bearer ${localStorage.getItem("accessToken")}`
        }
    });

export default axiosInstance;
