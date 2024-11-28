import axios from "axios";
import { baseURL } from "./apiUrl";

const axiosInstance = (accessToken?: string) =>
    axios.create({
        baseURL: baseURL,
        headers: {
            Authorization: accessToken
                ? `Bearer ${accessToken}`
                : `Bearer ${localStorage.getItem("accessToken")}`
        }
    });

export default axiosInstance;
