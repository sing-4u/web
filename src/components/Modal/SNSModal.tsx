import { DialogContentProps } from "../../types";
import Dialog from "./Modal";

const SNSDialogContent = ({ title }: DialogContentProps) => {
    return <Dialog>{title}</Dialog>;
};

export default SNSDialogContent;
