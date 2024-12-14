import { BaseModalProps } from "../../types";

interface SongRequestSuccessModalProps
    extends BaseModalProps<{
        artist?: string;
        title?: string;
        formId?: string | null;
    }> {}

export const SongRequestSuccessModal = ({
    title,
    data
}: SongRequestSuccessModalProps) => {
    if (!data) return;
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="flex flex-col mb-2">
                <h3 className="text-[18px] font-bold">{title}</h3>
            </div>
            {/* 그래디언트 테두리를 위한 컨테이너 */}
            <div className="w-full p-[1px] bg-gradient-to-br from-[#7B92C7] via-[#7846DD] to-[#BB7FA0] rounded-md mx-2">
                {/* 실제 컨텐츠를 담는 내부 컨테이너 */}
                <div className="w-full h-full bg-white rounded-[5px]">
                    <div className="bg-[#7846dd]/60 flex justify-center text-white p-3 font-bold mobile:text-[14px] tablet:text-[14px] pc:text-lg">
                        신청곡
                    </div>
                    <div className="px-3 py-2">
                        <div className="flex justify-between items-center border-b-[0.5px]">
                            <span className="font-bold pc:text-[14px] mobile:text-xs tablet:text-xs text-customGray pc:mb-2 pc:mt-2 mobile:mb-2 mobile:mt-2 tablet:mb-2 tablet:mt-2">
                                가수
                            </span>
                            <span className="font-bold pc:text-[14px] mobile:text-xs tablet:text-xs">
                                {data && data.artist}
                            </span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="font-bold pc:text-[14px] mobile:text-xs tablet:text-xs text-customGray pc:mb-2 pc:mt-2 mobile:mb-2 mobile:mt-2 tablet:mb-2 tablet:mt-2">
                                노래제목
                            </span>
                            <span className="font-bold pc:text-[14px] mobile:text-xs tablet:text-xs">
                                {data && data.title}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default SongRequestSuccessModal;
