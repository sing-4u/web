import { useNavigate } from "react-router-dom";
import Password from "../utils/Password";

const FindPassword = () => {
    const navigate = useNavigate();
    const handleNextButton = () => {
        navigate("/new-password");
    };
    return (
        <div className="w-full max-w-md mx-auto p-6 space-y-4">
            <Password title="비밀번호 변경" text1="닉네임" text2="비밀번호" />
            <button
                onClick={handleNextButton}
                className="w-full bg-black text-white rounded-[10px] h-[52px] font-Pretendard"
                type="submit"
            >
                다음1
            </button>
        </div>
    );
};

export default FindPassword;
