import Profile from "../../src/assets/img.svg";

const CompleteJoin = () => {
    return (
        <form action="">
            <div className="flex flex-col items-center">
                <img src={Profile} alt="" className="w-64 h-64 mb-4" />
                <div className="flex flex-col space-y-4 mb-10">
                    <strong className="font-Pretendard text-4xl font-bold">
                        회원가입 완료
                    </strong>
                    <strong className="font-Pretendard text-2xl font-bold">
                        당신의 음악이야기가 시작됩니다.
                    </strong>
                </div>
                <button
                    className="w-full bg-buttonBackgroundColor text-white rounded-lg h-14 font-Pretendard"
                    type="submit"
                >
                    로그인
                </button>
            </div>
        </form>
    );
};

export default CompleteJoin;
