import axios from "axios";
import useUserData from "../hooks/useUserData";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const getAccessToken = (): string | null => {
    return localStorage.getItem("accessToken");
};

export const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
};

export const authAxios = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`,
    headers: {
        Authorization: `Bearer ${getAccessToken()}`
    }
});

export const checkAuth = async (): Promise<boolean> => {
    try {
        const response = await authAxios.get(`/auth/test`);
        return response.status === 200;
    } catch {
        return false;
    }
};
