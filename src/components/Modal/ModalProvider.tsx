import { createContext, useState, ReactNode, ComponentType } from "react";
// import MainModal from "./MainModal";
import Modal from "./Modal";
import { ModalContentProps } from "../../types";

interface ModalContextProps {
    openModal: <T>(config: {
        title?: string;
        Content: ComponentType<ModalContentProps<T>>;
        errorMessage?: string;
        data?: T;
    }) => void;

    closeModal: () => void;
    isOpen: boolean;
}

export const ModalContext = createContext<ModalContextProps | undefined>(
    undefined
);

export function ModalProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState<string | undefined>("");
    const [content, setContent] = useState<
        ComponentType<ModalContentProps<unknown>> | undefined
    >();
    const [errorMessage, setErrorMessage] = useState<string | undefined>(
        undefined
    );

    const [modalData, setModalData] = useState<unknown>();

    const openModal = <T,>({
        title,
        Content,
        errorMessage,
        data
    }: {
        title?: string;
        Content: ComponentType<ModalContentProps<T>>;
        errorMessage?: string;
        data?: T;
    }) => {
        setTitle(title);
        setContent(() => Content as ComponentType<ModalContentProps<unknown>>);
        setErrorMessage(errorMessage);
        setModalData(data);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setTitle(undefined);
        setContent(undefined);
        setErrorMessage(undefined);
    };

    return (
        <ModalContext.Provider value={{ isOpen, openModal, closeModal }}>
            {children}
            <Modal
                isOpen={isOpen}
                title={title}
                Content={content}
                errorMessage={errorMessage}
                data={modalData}
            />
        </ModalContext.Provider>
    );
}
