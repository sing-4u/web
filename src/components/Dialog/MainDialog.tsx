import { DialogType } from "../../utils/dialogType";
import Dialog from "./Dialog";
import EmailDialogContent from "./EmailDialog";
import PasswordDialogContent from "./PasswordDialog";
import SuccessChangeEmailDialog from "./SuccessChangeEmailDialog";
import SuccessChangePasswordDialogContent from "./SuccessChangePasswordDialog";

const dialogConfigs = {
    email: {
        title: "이메일 변경",
        Content: EmailDialogContent
    },
    password: {
        title: "비밀번호 변경",
        Content: PasswordDialogContent
    },
    changePassword: {
        title: "비밀번호 변경이 완료되었습니다.",
        Content: SuccessChangePasswordDialogContent
    },
    changeEmail: {
        title: "이메일 변경이 완료되었습니다.",
        Content: SuccessChangeEmailDialog
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
