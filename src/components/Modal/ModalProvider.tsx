import { createContext, useState, ReactNode, ComponentType } from "react";
// import MainModal from "./MainModal";
import Modal from "./Modal";
import { ModalContentProps, ModalType } from "../../types";

interface ModalContextProps {
    openModal: <T>(config: {
        type: ModalType;
        title?: string;
        Content: ComponentType<ModalContentProps<T>>;
        data?: T;
        buttonBackgroundColor: string;
    }) => void;

    closeModal: () => void;
    // isOpen: boolean;
}

export const ModalContext = createContext<ModalContextProps | undefined>(
    undefined
);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
    const [modalConfig, setModalConfig] = useState<{
        type: ModalType;
        title?: string;
        Content: ComponentType<ModalContentProps<unknown>>;
        data?: unknown;
        buttonBackgroundColor?: string;
    } | null>(null);

    const openModal = <T,>({
        type,
        title,
        Content,
        data,
        buttonBackgroundColor
    }: {
        type: ModalType;
        title?: string;
        Content: ComponentType<ModalContentProps<T>>;
        data?: T;
        buttonBackgroundColor: string;
    }) => {
        setModalConfig({
            type,
            title,
            Content: Content as ComponentType<ModalContentProps<unknown>>,
            data,
            buttonBackgroundColor
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
                />
            )}
        </ModalContext.Provider>
    );
};
