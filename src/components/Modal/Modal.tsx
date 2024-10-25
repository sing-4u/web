import { useModal } from "../../hooks/useModal";

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
                    <button onClick={closeModal} className="text-gray-500">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

export default Modal;
