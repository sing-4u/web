import { createContext, useState, ReactNode } from "react";
import { ModalType } from "../../utils/modalType";
import MainModal from "./MainModal";

interface ModalContextProps {
    openModal: (type: ModalType) => void;
    closeModal: () => void;
    isOpen: boolean;
    type: ModalType | null;
}

export const ModalContext = createContext<ModalContextProps | undefined>(
    undefined
);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [type, setType] = useState<ModalType | null>(null);

    const openModal = (modalType: ModalType) => {
        setType(modalType);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setType(null);
    };

    return (
        <ModalContext.Provider value={{ isOpen, type, openModal, closeModal }}>
            {children}
            <MainModal isOpen={isOpen} type={type} onClose={closeModal} />
        </ModalContext.Provider>
    );
};
