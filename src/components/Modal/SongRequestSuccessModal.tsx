import CheckCircleFill from "../../assets/ic_CheckCircleFill.svg";
import { useModal } from "../../hooks/useModal";
import { ModalProps } from "../../types";

interface SongRequestSuccessModalProps
    extends ModalProps<{ artist: string; title: string; formId: string }> {}

export const SongRequestSuccessModal = ({
    title,
    data,
    buttonBackgroundColor
}: SongRequestSuccessModalProps) => {
    const { closeModal } = useModal();
    if (!data) return;
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="flex flex-col mb-2">
                <img src={CheckCircleFill} alt="" />
                <h3 className="text-[18px] font-bold">{title}</h3>
            </div>
            <div className="w-full border border-black rounded-md space-y-2 mx-2">
                <div className="bg-colorPurple flex justify-center text-white p-3">
                    신청곡
                </div>
                <div className="px-3 py-2 space-y-2">
                    <div className="flex justify-between border-b-[0.5px]">
                        <span className="font-bold text-customGray">가수</span>
                        <span className="font-bold border-b-[0.5px]">
                            {data && data.artist}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="font-bold text-customGray">
                            노래제목
                        </span>
                        <span className="font-bold">{data && data.title}</span>
                    </div>
                </div>
            </div>
            <button
                onClick={closeModal}
                className={`mt-6 rounded-md py-4 font-semibold text-white ${buttonBackgroundColor} w-full`}
            >
                확인
            </button>
        </div>
    );
};

export default SongRequestSuccessModal;
