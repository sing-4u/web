import { createContext, useState, ReactNode } from "react";
import MainDialog from "./MainDialog";
import { DialogType } from "../../utils/dialogType";

interface DialogContextProps {
    openDialog: (type: DialogType) => void;
    closeDialog: () => void;
    isOpen: boolean;
    type: DialogType | null;
}

export const DialogContext = createContext<DialogContextProps | undefined>(
    undefined
);

export const DialogProvider = ({ children }: { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [type, setType] = useState<DialogType | null>(null);

    const openDialog = (dialogType: DialogType) => {
        setType(dialogType);
        setIsOpen(true);
    };

    const closeDialog = () => {
        setIsOpen(false);
        setType(null);
    };

    return (
        <DialogContext.Provider
            value={{ isOpen, type, openDialog, closeDialog }}
        >
            {children}
            <MainDialog isOpen={isOpen} type={type} onClose={closeDialog} />
        </DialogContext.Provider>
    );
};
