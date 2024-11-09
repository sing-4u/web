import { ComponentType } from "react";
import { ModalContentProps } from "../../types";
import CloseButton from "../../../src/assets/btn_close.svg";

interface ModalProps<T> {
    onClose: () => void;
    title?: string;
    Content?: ComponentType<ModalContentProps<T>>;
    errorMessage?: string;
    data?: T;
    buttonBackgroundColor?: string;
}

export function Modal<T>({
    onClose,
    title,
    Content,
    data,
    errorMessage,
    buttonBackgroundColor
}: ModalProps<T>) {
    if (!Content) return null;

    return (
        <dialog
            className="fixed inset-0 bg-transparent p-0"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
            open
        >
            <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <div className="bg-white p-6 rounded-lg w-[328px] relative">
                    <div className="flex justify-center items-center mb-4">
                        <h2 className="text-lg font-bold">
                            {errorMessage || title}
                        </h2>
                        {!errorMessage ||
                            (errorMessage !== "" && (
                                <button onClick={onClose}>
                                    <img src={CloseButton} alt="Close" />
                                </button>
                            ))}
                    </div>
                    <Content
                        title={title}
                        data={data}
                        buttonBackgroundColor={buttonBackgroundColor}
                    />
                    {errorMessage && (
                        <button
                            onClick={onClose}
                            className="w-full py-3 bg-[#4D77FF] text-black rounded-lg mt-4"
                        >
                            확인
                        </button>
                    )}
                </div>
            </div>
        </dialog>
    );
}

export default Modal;
