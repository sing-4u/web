import { ComponentType } from "react";
import { ModalContentProps } from "../../types";
import { ModalType } from "../../utils/modalType";
import EmailModalContent from "./EmailModal";
import Modal from "./Modal";
import PasswordModalContent from "./PasswordModal";
import SNSModalContent from "./SNSModal";

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

interface MainModalProps {
    isOpen: boolean;
    onClose: () => void;
    type?: ModalType | null;
    errorMessage?: string;
}

const MainModal = ({ isOpen, onClose, type, errorMessage }: MainModalProps) => {
    if (!type) return null;

    const { title, Content } = modalConfigs[type];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            errorMessage={errorMessage}
        >
            <Content title={title} />
        </Modal>
    );
};

export default MainModal;
