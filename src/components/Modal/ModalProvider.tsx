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
        buttonBackgroundColor?: string;
    }) => void;

    closeModal: () => void;
    // isOpen: boolean;
}

export const ModalContext = createContext<ModalContextProps | undefined>(
    undefined
);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
    // const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState<string | undefined>("");
    const [content, setContent] = useState<
        ComponentType<ModalContentProps<unknown>> | undefined
    >();
    const [errorMessage, setErrorMessage] = useState<string | undefined>(
        undefined
    );

    const [modalData, setModalData] = useState<unknown>();
    const [buttonBackgroundColor, setButtonBackgroundColor] = useState<
        string | undefined
    >(undefined);

    const openModal = <T,>({
        title,
        Content,
        errorMessage,
        data,
        buttonBackgroundColor
    }: {
        title?: string;
        Content: ComponentType<ModalContentProps<T>>;
        errorMessage?: string;
        data?: T;
        buttonBackgroundColor?: string;
    }) => {
        setTitle(title);
        setContent(() => Content as ComponentType<ModalContentProps<unknown>>);
        setErrorMessage(errorMessage);
        setModalData(data);
        setButtonBackgroundColor(buttonBackgroundColor);
        // setIsOpen(true);
    };

    const closeModal = () => {
        // setIsOpen(false);
        setTitle(undefined);
        setContent(undefined);
        setErrorMessage(undefined);
    };

    return (
        <ModalContext.Provider value={{ openModal, closeModal }}>
            {children}
            <Modal
                // isOpen={isOpen}
                onClose={closeModal}
                title={title}
                Content={content}
                errorMessage={errorMessage}
                data={modalData}
                buttonBackgroundColor={buttonBackgroundColor}
            />
        </ModalContext.Provider>
    );
};
