import TriangleFill from "../../assets/ic_TriangleFill.svg";
import { useModal } from "../../hooks/useModal";

interface SongRequestFailModalProps<T extends Record<string, React.ReactNode>> {
    data?: T;
    buttonBackgroundColor?: string;
}

export const SongRequestFailModal = <
    T extends Record<string, React.ReactNode>
>({
    data,
    buttonBackgroundColor
}: SongRequestFailModalProps<T>) => {
    const { closeModal } = useModal();
    return (
        <>
            <div className="flex justify-center mt-[-15px]">
                <img src={TriangleFill} alt="" className="w-10 h-10 mb-1" />
            </div>
            <div className="text-center font-semibold mb-2">중복 신청</div>
            <div className="text-center font-[12px] mb-6">
                중복 신청 및 신청한 곡에 대해
                <br /> 취소 또는 수정이 불가합니다.
            </div>
            <div className="w-full border-2 border-[#7b92c7] rounded-[8px] box-border">
                <div className="bg-colorPurple flex justify-center text-white p-3">
                    신청곡
                </div>
                <div className="px-3 py-2 space-y-2 bg-white rounded-b-[8px]">
                    <div className="flex justify-between border-b-[0.5px]">
                        <span className="font-bold text-customGray">가수</span>
                        <span className="font-bold border-b-[0.5px]"></span>
                    </div>

                    <div className="flex justify-between">
                        <span className="font-bold text-customGray">
                            노래제목
                        </span>
                        <span className="font-bold">1</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-bold text-customGray">
                            신청 이메일
                        </span>
                        <span className="font-bold">{data?.email}</span>
                    </div>
                </div>
            </div>
            <button
                onClick={closeModal}
                className={`flex justify-center items-center rounded-md w-full h-12 mt-4 ${buttonBackgroundColor}`}
            >
                확인
            </button>
        </>
    );
};

export default SongRequestFailModal;
