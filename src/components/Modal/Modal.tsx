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

    const buttonClassName = `w-full py-3 ${buttonBackgroundColor} text-textColor rounded-lg mobile:mt-6 tablet:mt-6 pc:mt-6`;

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
                    className="bg-white mobile:pb-7 tablet:pb-7 mobile:px-6 tablet:px-6 pc:px-10 pc:pb-10 rounded-lg w-[90%] max-w-[460px] relative"
                    open
                >
                    <div
                        className={`flex ${
                            type === ModalType.DEFAULT
                                ? "flex-row justify-between items-center"
                                : type === ModalType.NOTLOGIN
                                ? "flex-col items-start"
                                : "flex-col items-center"
                        } mb-[6px]`}
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
                                            <div className="flex justify-center mobile:mt-6 tablet:mt-6 pc:mt-10">
                                                <img
                                                    src={TriangleFill}
                                                    alt=""
                                                    className="w-10 h-10 mb-[10px]"
                                                />
                                            </div>
                                        )}
                                </div>
                                <div className="flex flex-col">
                                    {type === ModalType.SUCCESS && (
                                        <div className="flex justify-center mobile:mt-10 tablet:mt-10 pc:mt-10">
                                            <img
                                                src={CheckCircleFill}
                                                alt=""
                                                className="mobile:w-8 mobile:h-8 tablet:w-8 tablet:h-8 pc:w-12 pc:h-12 mb-1 mobile:mb-[5px] tablet:mb-[5px] pc:mb-2"
                                            />
                                        </div>
                                    )}
                                    <h2 className="text-2xl font-bold mobile:mt-[5px] tablet:mt-[5px] pc:mt-2">
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
