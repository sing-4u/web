import SearchIcon from "../src/assets/ic_Search.svg";
import Card from "../src/assets/card.svg";
import SmallProfile from "../src/assets/profile_S.svg";

export default function Home() {
    const isLoggedIn = true;

    // const artists = [
    //     { name: "Luna Nova", image: "/path/to/luna_nova_image.jpg" },
    //     { name: "Solstice Heart", image: "/path/to/solstice_heart_image.jpg" },
    //     { name: "Liora Zepphyr", image: "/path/to/liora_zepphyr_image.jpg" },
    //     { name: "Luna Nova", image: "/path/to/luna_nova_image.jpg" },
    //     { name: "Solstice Heart", image: "/path/to/solstice_heart_image.jpg" },
    //     { name: "Liora Zepphyr", image: "/path/to/liora_zepphyr_image.jpg" }
    // ];
    return (
        <div className="w-full max-w-md mx-auto p-6 space-y-4">
            <div className="flex justify-between">
                <img src={Card} alt="" className="w-auto h-4" />
                {/* <img src={Card} alt="" className="w-4 h-4" /> */}
                {isLoggedIn ? (
                    <div className="flex items-center space-x-2">
                        <button className="bg-black text-white text-sm py-1 px-3 rounded-md">
                            신청곡 관리
                        </button>
                        <img
                            src={Card}
                            className="w-8 h-8 bg-gray-200 rounded-full"
                        />
                    </div>
                ) : (
                    <button className="bg-black text-white text-sm py-1 px-3 rounded-md">
                        로그인
                    </button>
                )}
            </div>
            <div className="relative">
                <input
                    type="text"
                    placeholder="아티스트명을 검색해주세요"
                    className="w-full border p-2 pl-10 rounded-[10px]"
                />
                <img
                    src={SearchIcon}
                    alt="Search Icon"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                {/* <img src={Card} className="w-full h-auto" />
                <img src={Card} className="w-full h-auto" />
                <img src={Card} className="w-full h-auto" />
                <img src={Card} className="w-full h-auto" />
                <img src={Card} className="w-full h-auto" />
                <img src={Card} className="w-full h-auto" />
                <img src={Card} className="w-full h-auto" /> */}
                {/* [...Array{10}].map((_,index))
                ` */}
                {/* Card를 여러개 배치 */}
                {Array(10)
                    .fill(0)
                    .map((_, index) => (
                        <div className="flex flex-col justify-center">
                            <img
                                key={index}
                                src={Card}
                                alt={`Card ${index + 1}`}
                                className="w-full h-auto hover:cursor-pointer"
                            />
                            <span className="mt-2 text-center font-bold">
                                아이유
                            </span>
                        </div>
                    ))}
            </div>

            <div className="space-y-2 font-Pretendard"></div>
            <button
                className="w-full bg-black text-white rounded-[10px] h-[52px] font-Pretendard"
                type="submit"
            ></button>
        </div>
    );
}
