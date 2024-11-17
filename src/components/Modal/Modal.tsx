import { BaseModalProps, ModalType } from "../../types";
import CloseButton from "../../../src/assets/btn_close.svg";

interface ModalExtendedProps<T> extends BaseModalProps<T> {
    onClose?: () => void;
}

export const Modal = <T,>({
    onClose,
    title,
    Content,
    data,
    type,
    buttonBackgroundColor
}: ModalExtendedProps<T>) => {
    if (!Content) return null;

    const buttonClassName = `w-full py-3 bg-[${buttonBackgroundColor}] text-textColor rounded-lg mt-4`;

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
                    className="bg-white p-10 rounded-lg w-[460px] relative"
                    open
                >
                    <div
                        className={`flex ${
                            type === ModalType.ERROR
                                ? "justify-center"
                                : "justify-between"
                        } items-center mb-4`}
                    >
                        <h2 className="text-2xl font-bold">{title}</h2>
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

                    {(type === ModalType.ERROR ||
                        type === ModalType.SUCCESS) && (
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
