import React, { useState, useEffect, useRef } from "react";
import SearchIcon from "../src/assets/ic_Search.svg";
import Card from "../src/assets/card.svg";
import Navbar from "./components/Navbar";

export default function Home() {
    const [items, setItems] = useState(Array(10).fill(0));
    const [loading, setLoading] = useState(false);
    const loaderRef = useRef(null);

    const loadMoreItems = () => {
        setLoading(true);
        // TODO : 추후에 수정 필요
        setTimeout(() => {
            setItems((prevItems) => [...prevItems, ...Array(10).fill(0)]);
            setLoading(false);
        }, 1000);
    };

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
                    <div key={index} className="flex flex-col justify-center">
                        <img
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

            <div ref={loaderRef} className="text-center">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <button
                        className="w-full bg-black text-white rounded-[10px] h-[52px] font-Pretendard"
                        onClick={loadMoreItems}
                    >
                        더보기
                    </button>
                )}
            </div>
        </div>
    );
}
