import { useModal } from "../../hooks/useModal";
import CloseButton from "../../../src/assets/btn_close.svg";

export interface DialogProps {
    isOpen?: boolean;
    onClose?: () => void;
    title?: string;
    children?: React.ReactNode;
}

const Modal = ({ isOpen, title, children }: DialogProps) => {
    const { closeModal } = useModal();
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-[328px]">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">{title}</h2>
                    <button onClick={closeModal}>
                        <img src={CloseButton} alt="close" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

export default Modal;
