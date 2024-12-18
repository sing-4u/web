interface SongRequestData {
    artist: string;
    title: string;
    email: string;
}

interface BaseModalData {
    existingRequest?: Partial<SongRequestData>; // 기존 신청곡
    [key: string]: unknown;
}

interface SongRequestFailModalProps<T extends BaseModalData> {
    title?: string;
    data?: T;
    buttonBackgroundColor?: string;
}

export const SongRequestFailModal = <T extends BaseModalData>({
    data
}: SongRequestFailModalProps<T>) => {
    const songToShow = data?.existingRequest;
    return (
        <>
            <div className="text-center font-[12px] mb-6">
                중복 신청 및 신청한 곡에 대해
                <br /> 취소 또는 수정이 불가합니다.
            </div>
            <div className="w-full p-[1px] bg-gradient-to-br from-[#7B92C7] via-[#7846DD] to-[#BB7FA0] rounded-[8px]">
                <div className="w-full h-full bg-white rounded-[7px] overflow-hidden">
                    <div className="bg-[#7846dd]/60 flex justify-center text-white p-3 font-bold mobile:text-[14px] tablet:text-[14px] pc:text-lg">
                        신청곡
                    </div>
                    <div className="px-3 py-2">
                        <div className="flex justify-between items-center border-b-[0.5px] border-[#f4f4f4]">
                            <span className="font-bold text-customGray mobile:text-xs pc:text-[14px] pc:mb-2 pc:mt-2 mobile:mb-2 mobile:mt-2 tablet:mb-2 tablet:mt-2">
                                가수
                            </span>
                            <span className="font-bold mobile:text-xs tablet:text-xs pc:text-[14px]">
                                {songToShow?.artist}
                            </span>
                        </div>

                        <div className="flex justify-between items-center border-b-[0.5px] border-[#f4f4f4]">
                            <span className="font-bold text-customGray mobile:text-xs pc:text-[14px] pc:mb-2 pc:mt-2 mobile:mb-2 mobile:mt-2 tablet:mb-2 tablet:mt-2">
                                노래제목
                            </span>
                            <span className="font-bold mobile:text-xs tablet:text-xs pc:text-[14px]">
                                {songToShow?.title}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-customGray mobile:text-xs pc:text-[14px] pc:mb-2 pc:mt-2 mobile:mb-2 mobile:mt-2 tablet:mb-2 tablet:mt-2">
                                신청 이메일
                            </span>
                            <span className="font-bold mobile:text-xs tablet:text-xs pc:text-[14px]">
                                {songToShow?.email}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SongRequestFailModal;
