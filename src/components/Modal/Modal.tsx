import { ComponentType } from "react";
import { ModalContentProps, ModalType } from "../../types";
import CloseButton from "../../../src/assets/btn_close.svg";

interface ModalProps<T> {
    onClose?: () => void;
    title?: string;
    Content?: ComponentType<ModalContentProps<T>>;
    type: ModalType;
    data?: T;
    buttonBackgroundColor?: string;
}

export const Modal = <T,>({
    onClose,
    title,
    Content,
    data,
    type,
    buttonBackgroundColor
}: ModalProps<T>) => {
    if (!Content) return null;

    const buttonClassName = `w-full py-3 ${buttonBackgroundColor} text-textColor rounded-lg mt-4`;

    const onClickModal = (event: React.MouseEvent<HTMLElement>) => {
        if (event.target === event.currentTarget) onClose?.();
    };
    return (
        <div
            className="fixed inset-0 bg-transparent p-0"
            onClick={onClickModal}
        >
            <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <dialog
                    className="bg-white p-6 rounded-lg w-[328px] relative"
                    open
                >
                    <div
                        className={`flex ${
                            type === ModalType.ERROR
                                ? "justify-center"
                                : "justify-between"
                        } items-center mb-4`}
                    >
                        <h2 className="text-lg font-bold">{title}</h2>
                        {/* 성공도 실패도 아닐 경우(이메일 변경 모달, 비밀번호 변경 모달) */}
                        {type === ModalType.DEFAULT && (
                            <button onClick={onClose}>
                                <img src={CloseButton} alt="Close" />
                            </button>
                        )}
                        {/*  */}
                    </div>
                    <Content
                        data={data}
                        buttonBackgroundColor={buttonBackgroundColor}
                    />

                    {type === ModalType.ERROR && (
                        <button onClick={onClose} className={buttonClassName}>
                            확인
                        </button>
                    )}
                    {type === ModalType.DEFAULT && (
                        <button onClick={onClose} className={buttonClassName}>
                            확인
                        </button>
                    )}
                </dialog>
            </div>
        </div>
    );
};

export default Modal;
