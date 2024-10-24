import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUserData from "./useUserData";

export const useAuthRedirect = (redirectPath: string = "/") => {
    const { data: userData, isLoading } = useUserData();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && userData) {
            navigate(redirectPath, { replace: true });
        }
    }, [userData, isLoading, navigate, redirectPath]);

    return { isLoading, isAuthenticated: !!userData };
};
