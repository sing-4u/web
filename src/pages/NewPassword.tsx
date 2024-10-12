import Password from "../utils/Password";

const NewPassword = () => {
    return (
        <div className="w-full max-w-md mx-auto p-6 space-y-4">
            <Password
                title="새 비밀번호 설정"
                text1="새 비밀번호"
                text2="새 비밀번호 확인"
                type="password"
            />
            <button
                className="w-full bg-black text-white rounded-[10px] h-[52px] font-Pretendard"
                type="submit"
            >
                비밀번호 변경하기
            </button>
        </div>
    );
};

export default NewPassword;
