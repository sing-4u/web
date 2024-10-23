import Dialog from "./Dialog";
import EmailDialogContent from "./EmailDialog";
import PasswordDialogContent from "./PasswordDialog";
import SuccessChangePasswordDialogContent from "./SuccessChangePasswordDialog";

type DialogType = "email" | "password" | "changePasssword";

const dialogConfigs = {
    email: {
        title: "이메일 변경",
        Content: EmailDialogContent
    },
    password: {
        title: "비밀번호 변경",
        Content: PasswordDialogContent
    },
    changePasssword: {
        title: "비밀번호 변경이 완료되었습니다.",
        Content: SuccessChangePasswordDialogContent
    }
};

interface MainDialogProps {
    isOpen: boolean;
    onClose: () => void;
    type: DialogType;
}

const MainDialog = ({ isOpen, onClose, type }: MainDialogProps) => {
    const { title, Content } = dialogConfigs[type];

    return (
        <Dialog isOpen={isOpen} onClose={onClose} title={title}>
            <Content onClose={onClose} />
        </Dialog>
    );
};

export default MainDialog;
