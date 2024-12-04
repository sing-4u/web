import { createContext, useState, ReactNode, ComponentType } from "react";
// import MainModal from "./MainModal";
import Modal from "./Modal";
import { BaseModalProps, ModalContentProps } from "../../types";

export interface ModalContextProps {
    openModal: <T>(config: BaseModalProps<T>) => void;

    closeModal: () => void;
}

export const ModalContext = createContext<ModalContextProps | undefined>(
    undefined
);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
    const [modalConfig, setModalConfig] =
        useState<BaseModalProps<unknown> | null>(null);

    const openModal = <T,>({
        type,
        title,
        Content,
        data,
        buttonBackgroundColor,
        showErrorIcon = true
    }: BaseModalProps<T>) => {
        setModalConfig({
            type,
            title,
            Content: Content as ComponentType<ModalContentProps<unknown>>, // Content는 ComponentType<ModalContentProps<unknown>>로 변환
            data,
            buttonBackgroundColor,
            showErrorIcon
        });
    };

    const closeModal = () => {
        setModalConfig(null);
    };

    return (
        <ModalContext.Provider value={{ openModal, closeModal }}>
            {children}
            {modalConfig && (
                <Modal
                    onClose={closeModal}
                    type={modalConfig?.type}
                    title={modalConfig?.title}
                    Content={modalConfig?.Content}
                    data={modalConfig?.data}
                    buttonBackgroundColor={modalConfig?.buttonBackgroundColor}
                    showErrorIcon={modalConfig?.showErrorIcon}
                />
            )}
        </ModalContext.Provider>
    );
};
