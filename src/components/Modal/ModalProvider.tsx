import { createContext, useState, ReactNode } from "react";
import { ModalType } from "../../utils/modalType";
// import MainModal from "./MainModal";
import Modal from "./Modal";
import { SongRequestData } from "../../types";

interface ModalContextProps {
    openModal: (
        type: ModalType,
        data?: SongRequestData,
        errorMessage?: string
    ) => void;

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
    const [modalData, setModalData] = useState<SongRequestData>();

    const openModal = (
        modalType: ModalType,
        data?: SongRequestData,
        errorMessage?: string
    ) => {
        setType(modalType);

        setModalData(data);
        setIsOpen(true);

        if (errorMessage) setErrorMessage(errorMessage);
    };

    const closeModal = () => {
        setIsOpen(false);
        setType(null);
        setModalData(undefined);
    };

    return (
        <ModalContext.Provider value={{ isOpen, type, openModal, closeModal }}>
            {children}
            <Modal
                isOpen={isOpen}
                type={type}
                errorMessage={errorMessage}
                data={modalData}
            />
        </ModalContext.Provider>
    );
};
