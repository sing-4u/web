import { DialogContentProps } from "../../types";
import { DialogType } from "../../utils/dialogType";
import Dialog from "./Dialog";
import EmailDialogContent from "./EmailDialog";
import PasswordDialogContent from "./PasswordDialog";
import SuccessChangeEmailDialogContent from "./SuccessChangeEmailDialog";
import SuccessChangePasswordDialogContent from "./SuccessChangePasswordDialog";

interface DialogConfigProps {
    title: string;
    Content: React.ComponentType<DialogContentProps>;
}

const dialogConfigs: Record<DialogType, DialogConfigProps> = {
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
    }
};

interface MainDialogProps {
    isOpen: boolean;
    onClose: () => void;
    type?: DialogType | null;
}

const MainDialog = ({ isOpen, onClose, type }: MainDialogProps) => {
    if (!type) return null;

    const { title, Content } = dialogConfigs[type];

    return (
        <Dialog isOpen={isOpen} onClose={onClose} title={title}>
            <Content title={title} />
        </Dialog>
    );
};

export default MainDialog;
