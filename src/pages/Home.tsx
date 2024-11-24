import { useState, useEffect, useRef, useCallback } from "react";
import SearchIcon from "../assets/ic_Search.svg";
import Card from "../assets/card.svg";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useTitle } from "../utils/useTitle";
import axiosInstance from "../utils/axiosInstance";

interface UserProps {
    id: string;
    name: string;
    image: string;
    isOpened: boolean;
}

export default function Home() {
    const navigate = useNavigate();
    const [users, setUsers] = useState<UserProps[]>([]);
    const [loading, setLoading] = useState(false);
    const loaderRef = useRef(null);

    const loadMoreItems = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axiosInstance().get(
                `${import.meta.env.VITE_API_URL}/users`,
                {
                    params: {
                        size: 10,
                        index: users.length
                    }
                }
            );
            setUsers((prevUsers) => [...prevUsers, ...response.data]);
        } catch (error) {
            console.error("데이터를 불러오는 중 오류가 발생했습니다:", error);
        } finally {
            setLoading(false);
        }
    }, [users.length]);

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
    }, [loadMoreItems]);

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
        <div className="w-full mx-auto p-6 space-y-4 pc:px-[191px]">
            <Navbar />

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
            <div className="grid extraSmall:grid-cols-2 w-full gap-4 lg:grid-cols-4 tablet:grid-cols-3">
                {users.map((user, index) => (
                    <div key={`${user.id}_${index}`} className="flex flex-col">
                        <div className="relative rounded-[20px] p-[5px] bg-gradient-to-br from-yellow-200 via-pink-200 to-blue-200 flex flex-col justify-center">
                            <div
                                className="relative aspect-square w-full h-0 pb-[100%]"
                                onClick={handleSongDetailClick}
                            >
                                <img
                                    src={user.image || Card}
                                    alt={`${user.name}의 프로필 이미지`}
                                    className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                                />
                                {user.isOpened && (
                                    <div className="absolute top-2 left-2 bg-gradient-to-r from-[#7B92C7] via-[#7846DD] to-[#BB7FA0] text-xs font-bold py-1 px-2 rounded-md border border-black">
                                        신청곡 받는 중
                                    </div>
                                )}
                            </div>
                        </div>
                        <span className="mt-2 text-center font-bold">
                            {user.name}
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
