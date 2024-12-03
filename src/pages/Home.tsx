import { useState, useEffect, useRef, useCallback } from "react";
import SearchIcon from "../assets/ic_Search.svg";
import Card from "../assets/card.svg";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useTitle } from "../hooks/useTitle";
import axiosInstance from "../utils/axiosInstance";
import { baseURL } from "../utils/apiUrl";

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
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);

    const loadInitialData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axiosInstance().get(`${baseURL}/users`, {
                params: {
                    size: 10,
                    index: 0
                }
            });

            setUsers(response.data);
            setPage((prevPage) => prevPage + 1);
            setHasMore(response.data.length === 10);

            if (response.data.length < 10) {
                setHasMore(false);
            }
        } catch (error) {
            console.error("초기 데이터 로드 중 오류 발생:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const loadMoreItems = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const response = await axiosInstance().get(`${baseURL}/users`, {
                params: {
                    size: 10,
                    index: page
                }
            });

            if (response.data.length > 0) {
                setUsers((prevUsers) => [...prevUsers, ...response.data]);
                setPage((prevPage) => prevPage + 1);
            }

            if (response.data.length < 10) {
                setHasMore(false);
            }
        } catch (error) {
            console.error("추가 데이터 로드 중 오류 발생:", error);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    }, [loading, hasMore, page]);

    const setTitle = useTitle();

    setTimeout(() => {
        setTitle("홈");
    }, 100);

    useEffect(() => {
        loadInitialData();
    }, [loadInitialData]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const first = entries[0];
                if (first.isIntersecting && !loading && hasMore) {
                    loadMoreItems();
                }
            },
            { threshold: 0.1, rootMargin: "100px" }
        );

        const currentLoaderRef = loaderRef.current;
        if (currentLoaderRef) {
            observer.observe(currentLoaderRef);
        }

        return () => {
            if (currentLoaderRef) {
                observer.unobserve(currentLoaderRef);
            }
            observer.disconnect();
        };
    }, [loadMoreItems, loading, hasMore]);

    const handleSongDetailClick = (user: UserProps) => {
        navigate(`/song-detail?formId=${user.id}`, {
            state: {
                user: {
                    id: user.id,
                    name: user.name,
                    image: user.image,
                    isOpened: user.isOpened
                }
            }
        });
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
            <div className="grid mobile:grid-cols-2 w-full gap-4 pc:grid-cols-4 tablet:grid-cols-3">
                {users.map((user, index) => (
                    <div key={`${user.id}_${index}`} className="flex flex-col">
                        <div className="relative rounded-[20px] border-[4px] border-[#e1e1e1] overflow-hidden">
                            <div
                                className="relative aspect-square w-full"
                                onClick={handleSongDetailClick}
                            >
                                <img
                                    src={user.image || Card}
                                    alt={`${user.name}의 프로필 이미지`}
                                    className="w-full h-full object-cover"
                                />
                                {user.isOpened && (
                                    <div className="absolute top-2 left-2 bg-gradient-to-br from-[#7B92C7] via-[#7846DD] to-[#BB7FA0] text-xs font-bold py-1 px-2 rounded-md border border-black">
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

            <div
                ref={loaderRef}
                className="w-full h-20 flex items-center justify-center mt-4"
            >
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    hasMore && (
                        <button
                            className="w-full bg-black text-white rounded-[10px] h-[52px]"
                            onClick={loadMoreItems}
                        >
                            더보기
                        </button>
                    )
                )}
            </div>
        </div>
    );
}
