import { ComponentType } from "react";
import { useModal } from "../../hooks/useModal";
import { ModalContentProps } from "../../types";
import { ModalType } from "../../utils/modalType";
import EmailModalContent from "./EmailModal";
import PasswordModalContent from "./PasswordModal";
import SNSModalContent from "./SNSModal";
import CloseButton from "../../../src/assets/btn_close.svg";

interface ModalConfigProps {
    title?: string;
    Content: ComponentType<ModalContentProps>;
}

const modalConfigs: Record<ModalType, ModalConfigProps> = {
    email: {
        title: "이메일 변경",
        Content: EmailModalContent
    },
    password: {
        title: "비밀번호 변경",
        Content: PasswordModalContent
    },
    sns: {
        Content: SNSModalContent
    }
};

interface ModalProps {
    isOpen: boolean;
    type?: ModalType | null;
    errorMessage?: string;
}

const Modal = ({ isOpen, type, errorMessage }: ModalProps) => {
    const { closeModal } = useModal();

    if (!isOpen || !type) return null;

    const { title, Content } = modalConfigs[type];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-[328px]">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">
                        {errorMessage ? errorMessage : title}
                    </h2>
                    {!errorMessage && (
                        <button onClick={closeModal}>
                            <img src={CloseButton} alt="close" />
                        </button>
                    )}
                </div>
                <Content title={title} />
                {errorMessage && (
                    <button
                        onClick={closeModal}
                        className="w-full py-3 bg-[#4D77FF] text-white rounded-lg"
                    >
                        확인
                    </button>
                )}
            </div>
        </div>
    );
};

export default Modal;
