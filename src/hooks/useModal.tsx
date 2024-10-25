import { useContext } from "react";
import { ModalContext } from "../components/Modal/ModalProvider";

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context)
        throw new Error("useModal must be used within a ModalDialogProvider");
    return context;
};
