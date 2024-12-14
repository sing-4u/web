import { BaseModalProps, ModalType } from "../../types";
import CloseButton from "../../../src/assets/btn_close.svg";
import TriangleFill from "../../../src/assets/ic_TriangleFill.svg";
import CheckCircleFill from "../../../src/assets/ic_CheckCircleFill.svg";
import { useEffect } from "react";

interface ModalExtendedProps<T> extends BaseModalProps<T> {
    onClose?: () => void;
    showErrorIcon?: boolean;
}

export const Modal = <T,>({
    onClose,
    title,
    Content,
    data,
    type,
    buttonBackgroundColor,
    showErrorIcon = true
}: ModalExtendedProps<T>) => {
    // useEffect(() => {
    //     const scrollY = window.scrollY;
    //     document.body.style.position = "fixed";
    //     document.body.style.top = `-${scrollY}px`;
    //     document.body.style.width = "100%";
    //     document.body.style.overflow = "hidden";

    //     // 모달 외부 요소에 aria-hidden 속성 추가
    //     document
    //         .querySelector("body > *:not(.modal-root)")
    //         ?.setAttribute("aria-hidden", "true");

    //     return () => {
    //         document.body.style.position = "";
    //         document.body.style.top = "";
    //         document.body.style.width = "";
    //         document.body.style.overflow = "";
    //         window.scrollTo(0, scrollY);

    //         // aria-hidden 속성 제거
    //         document
    //             .querySelector("body > *:not(.modal-root)")
    //             ?.removeAttribute("aria-hidden");
    //     };
    // }, []);
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
                    className="bg-white p-10 rounded-lg w-[90%] max-w-[460px] relative"
                    open
                >
                    <div
                        className={`flex ${
                            type === ModalType.DEFAULT
                                ? "flex-row justify-between items-center"
                                : type === ModalType.NOTLOGIN
                                ? "flex-col items-start"
                                : "flex-col items-center"
                        } mb-4`}
                    >
                        {type === ModalType.DEFAULT ? (
                            <>
                                <h2 className="text-2xl font-bold text-left">
                                    {title}
                                </h2>
                                <button
                                    onClick={onClose}
                                    aria-label="모달 닫기"
                                >
                                    <img src={CloseButton} alt="Close" />
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="flex">
                                    {type === ModalType.ERROR &&
                                        showErrorIcon && (
                                            <div className="flex justify-center mt-[-15px]">
                                                <img
                                                    src={TriangleFill}
                                                    alt=""
                                                    className="w-10 h-10 mb-1"
                                                />
                                            </div>
                                        )}
                                </div>
                                <div className="flex flex-col">
                                    {type === ModalType.SUCCESS && (
                                        <div className="flex justify-center mt-[-15px]">
                                            <img
                                                src={CheckCircleFill}
                                                alt=""
                                                className="w-10 h-10 mb-1"
                                            />
                                        </div>
                                    )}
                                    <h2 className="text-2xl font-bold">
                                        {title}
                                    </h2>
                                </div>
                            </>
                        )}
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
