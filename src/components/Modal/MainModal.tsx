import { ComponentType } from "react";
import { ModalContentProps } from "../../types";
import { ModalType } from "../../utils/modalType";
import EmailModalContent from "./EmailModal";
import Modal from "./Modal";
import PasswordModalContent from "./PasswordModal";
import SNSModalContent from "./SNSModal";
import SuccessChangeEmailModalContent from "./SuccessChangeEmailModal";
import SuccessChangePasswordModalContent from "./SuccessChangePasswordModal";

interface ModalConfigProps {
    title: string;
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
    changePassword: {
        title: "비밀번호 변경 완료",
        Content: SuccessChangePasswordModalContent
    },
    changeEmail: {
        title: "이메일 변경 완료",
        Content: SuccessChangeEmailModalContent
    },
    sns: {
        title: "SNS로 가입된 계정입니다.",
        Content: SNSModalContent
    }
};

interface MainModalProps {
    isOpen: boolean;
    onClose: () => void;
    type?: ModalType | null;
}

const MainModal = ({ isOpen, onClose, type }: MainModalProps) => {
    if (!type) return null;

    const { title, Content } = modalConfigs[type];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <Content title={title} />
        </Modal>
    );
};

export default MainModal;
