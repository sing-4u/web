import { DialogContentProps } from "../../types";
import { ModalType } from "../../utils/modalType";
import Dialog from "./Modal";
import EmailDialogContent from "./EmailModal";
import PasswordDialogContent from "./PasswordModal";
import SNSDialogContent from "./SNSModal";
import SuccessChangeEmailDialogContent from "./SuccessChangeEmailModal";
import SuccessChangePasswordDialogContent from "./SuccessChangePasswordModal";

interface DialogConfigProps {
    title: string;
    Content: React.ComponentType<DialogContentProps>;
}

const dialogConfigs: Record<ModalType, DialogConfigProps> = {
    email: {
        title: "이메일 변경",
        Content: EmailDialogContent
    },
    password: {
        title: "비밀번호 변경",
        Content: PasswordDialogContent
    },
    changePassword: {
        title: "비밀번호 변경 완료",
        Content: SuccessChangePasswordDialogContent
    },
    changeEmail: {
        title: "이메일 변경 완료",
        Content: SuccessChangeEmailDialogContent
    },
    sns: {
        title: "SNS로 가입된 계정입니다.",
        Content: SNSDialogContent
    }
};

interface MainModalProps {
    isOpen: boolean;
    onClose: () => void;
    type?: ModalType | null;
}

const MainModal = ({ isOpen, onClose, type }: MainModalProps) => {
    if (!type) return null;

    const { title, Content } = dialogConfigs[type];

    return (
        <Dialog isOpen={isOpen} onClose={onClose} title={title}>
            <Content title={title} />
        </Dialog>
    );
};

export default MainModal;
