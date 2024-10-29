import { createContext, useState, ReactNode } from "react";
import { ModalType } from "../../utils/modalType";
// import MainModal from "./MainModal";
import Modal from "./Modal";

interface ModalContextProps {
    openModal: (type: ModalType, errorMessage?: string) => void;
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
    const [errorMessage, setErrorMessage] = useState<string | undefined>(
        undefined
    );

    const openModal = (modalType: ModalType, errorMessage?: string) => {
        setType(modalType);
        setIsOpen(true);
        if (errorMessage) setErrorMessage(errorMessage);
    };

    const closeModal = () => {
        setIsOpen(false);
        setType(null);
    };

    return (
        <ModalContext.Provider value={{ isOpen, type, openModal, closeModal }}>
            {children}
            <Modal isOpen={isOpen} type={type} errorMessage={errorMessage} />
        </ModalContext.Provider>
    );
};
