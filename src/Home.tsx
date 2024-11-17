import { useState, useEffect, useRef } from "react";
import SearchIcon from "../src/assets/ic_Search.svg";
import Card from "../src/assets/card.svg";
import Navbar from "./components/Navbar";
import { useNavigate } from "react-router-dom";
import { useTitle } from "./utils/useTitle";

export default function Home() {
    const navigate = useNavigate();
    const [items, setItems] = useState(Array(10).fill(0));
    const [loading, setLoading] = useState(false);
    const loaderRef = useRef(null);

    const [isReceipted, setIsReceipted] = useState(true);

    const loadMoreItems = () => {
        setLoading(true);
        // TODO : 추후에 수정 필요
        setTimeout(() => {
            setItems((prevItems) => [...prevItems, ...Array(10).fill(0)]);
            setLoading(false);
        }, 1000);
    };

    const setTitle = useTitle();

    setTimeout(() => {
        setTitle("홈");
    }, 100);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const first = entries[0];
                if (first.isIntersecting) {
                    loadMoreItems();
                }
            },
            { threshold: 1 }
        );

        const currentLoaderRef = loaderRef.current;
        if (currentLoaderRef) {
            observer.observe(currentLoaderRef);
        }

        return () => {
            if (currentLoaderRef) {
                observer.unobserve(currentLoaderRef);
            }
        };
    }, []);

    const handleSongDetailClick = () => {
        navigate("/song-detail");
    };

    return (
        <div className="w-full max-w-md mx-auto p-6 space-y-4">
            <div className="flex justify-between">
                <Navbar />
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
                {items.map((_, index) => (
                    <div key={index} className="flex flex-col">
                        <div className="relative rounded-[20px] p-[5px] bg-gradient-to-br from-yellow-200 via-pink-200 to-blue-200 flex flex-col justify-center">
                            <div
                                className="relative aspect-square"
                                onClick={handleSongDetailClick}
                            >
                                <img
                                    src={Card}
                                    alt={`Card ${index + 1}`}
                                    className="w-full h-full hover:cursor-pointer rounded-2xl object-cover"
                                />
                                {isReceipted && (
                                    <div className="absolute top-2 left-2 bg-yellow-300 text-xs font-bold py-1 px-2 rounded-md border border-black">
                                        접수 중
                                    </div>
                                )}
                            </div>
                        </div>
                        <span className="mt-2 text-center font-bold">
                            아이유
                        </span>
                    </div>
                ))}
            </div>

            <div ref={loaderRef} className="text-center">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <button
                        className="w-full bg-black text-white rounded-[10px] h-[52px]"
                        onClick={loadMoreItems}
                    >
                        더보기
                    </button>
                )}
            </div>
        </div>
    );
}
