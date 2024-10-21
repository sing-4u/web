import Dialog from "./Dialog/Dialog";
import EmailDialogContent from "./Dialog/EmailDialog";
import PasswordDialogContent from "./Dialog/PasswordDialog";

type DialogType = "email" | "password";

const dialogConfigs = {
    email: {
        title: "이메일 변경",
        Content: EmailDialogContent
    },
    password: {
        title: "비밀번호 변경",
        Content: PasswordDialogContent
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
