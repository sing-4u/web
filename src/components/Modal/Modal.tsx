import { ComponentType } from "react";
import { useModal } from "../../hooks/useModal";
import { ModalContentProps } from "../../types";
import CloseButton from "../../../src/assets/btn_close.svg";

interface ModalProps<T> {
    isOpen: boolean;
    title?: string;
    Content?: ComponentType<ModalContentProps<T>>;
    errorMessage?: string;
    data?: T;
}

export function Modal<T>({
    isOpen,
    title,
    Content,
    data,
    errorMessage
}: ModalProps<T>) {
    const { closeModal } = useModal();

    if (!isOpen || !Content) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-[328px]">
                <div className="flex justify-center items-center mb-4">
                    <h2 className="text-lg font-bold ">
                        {errorMessage ? errorMessage : title}
                    </h2>
                    {!errorMessage ||
                        (errorMessage !== "" && (
                            <button onClick={closeModal}>
                                <img src={CloseButton} alt="close" />
                            </button>
                        ))}
                </div>
                <Content title={title} data={data} />
                {errorMessage ||
                    (errorMessage === "" && (
                        <button
                            onClick={closeModal}
                            className="w-full py-3 bg-[#4D77FF] text-black rounded-lg"
                        >
                            확인
                        </button>
                    ))}
            </div>
        </div>
    );
}

export default Modal;
