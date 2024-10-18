import { useState } from "react";

interface ToastProps {
    id: number;
    type: "success" | "error" | "warning" | "info";
    message: string;
}

export const useToast = () => {
    const [toasts, setToasts] = useState<ToastProps[]>([]);

    const showToast = (type: ToastProps["type"], message: string): void => {
        const newToast: ToastProps = { id: Date.now(), type, message };
        setToasts((prevToasts) => [...prevToasts, newToast]);

        setTimeout(() => {
            setToasts((prevToasts) =>
                prevToasts.filter((toast) => toast.id !== newToast.id)
            );
        }, 3000);
    };

    return { toasts, showToast };
};
