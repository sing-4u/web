export const NonListNow = () => {
  return (
    <div className="relative border-2 rounded-[8px] mt-6">
      <div className="p-3 w-[327px] h-[178px] font-semibold text-[18px] leading-[21.48px]">
        현재 신청 곡 순위
        <div className="flex absolute top-[55px] left-[20px] justify-center items-center text-center w-[287px] h-[97px] text-[12px] leading-[16px] border-2 opacity-50">
          신청곡 게시물이 없습니다.
          <br /> 신청곡을 받아보세요
        </div>
      </div>
    </div>
  );
};

export const NonListPrevious = () => {
  return (
    <div className="relative border-2 rounded-[8px] mt-6">
      <div className="p-3 w-[327px] h-[178px] font-semibold text-[18px] leading-[21.48px]">
        이전 신청 곡 순위
        <div className="flex absolute top-[55px] left-[20px] justify-center items-center text-center w-[287px] h-[97px] text-[12px] leading-[16px] border-2 opacity-50">
          아직 이전 신청곡이 없습니다.
          <br /> 신청곡이 쌓이면 보여드릴게요.
        </div>
      </div>
    </div>
  );
};
