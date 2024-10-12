import eyeOff from "../../src/assets/icons_pw_off.png";

const Password = ({
    title,
    text1,
    text2
}: {
    title: string;
    text1: string;
    text2: string;
}) => {
    return (
        <>
            <div className="flex">로고</div>
            <div className="text-2xl font-bold text-center">{title}</div>
            <div className="space-y-4">
                <div className="relative flex flex-col">
                    <label
                        htmlFor="email"
                        className="text-left font-Pretendard mb-2"
                    >
                        {text1}
                    </label>
                    <input
                        placeholder="abc@email.com"
                        className="border rounded-[10px] py-[14px] px-[18px] placeholder:font-Pretendard"
                    />
                </div>
                <div className="relative flex flex-col">
                    <label
                        htmlFor="password"
                        className="text-left font-Pretendard mb-2"
                    >
                        {text2}
                    </label>
                    <input
                        placeholder="비밀번호"
                        className="border rounded-[10px] py-[14px] px-[18px] placeholder:font-Pretendard"
                    />
                    <span className="flex justify-end items-center">
                        <img
                            src={eyeOff}
                            alt="Toggle Confirm Password Visibility"
                            className="absolute inset-y-12 end-3 cursor-pointer"
                        />
                    </span>
                    <span className="text-red-500"></span>

                    <span className="flex justify-end items-center"></span>
                </div>
            </div>
        </>
    );
};

export default Password;
