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

    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

    const loadUsers = useCallback(
        async (keyword: string = "", pageIndex: number = 0) => {
            setLoading(true);
            try {
                const response = await axiosInstance().get(`${baseURL}/users`, {
                    params: {
                        size: 10,
                        index: pageIndex,
                        name: keyword
                    }
                });

                if (pageIndex === 0) {
                    setUsers(response.data);
                } else {
                    setUsers((prevUsers) => [...prevUsers, ...response.data]);
                }
                setPage(pageIndex + 1);
                setHasMore(response.data.length === 10);
            } catch (error) {
                console.error("데이터 로드 중 오류 발생:", error);
                setHasMore(false);
            } finally {
                setLoading(false);
            }
        },
        []
    );

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
        const debounceTimer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);

        return () => {
            clearTimeout(debounceTimer);
        };
    }, [searchTerm]);

    useEffect(() => {
        if (debouncedSearchTerm !== "") {
            setPage(0);
            loadUsers(debouncedSearchTerm, 0);
        } else {
            loadInitialData();
        }
    }, [debouncedSearchTerm, loadUsers, loadInitialData]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

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

    const handleFeedBackClick = () => {
        window.open(
            "https://forms.gle/a2PgcpA7De8UxQp17",
            "_blank",
            "noopener,noreferrer"
        );
    };

    const handleInquiryClick = () => {
        window.open(
            "https://forms.gle/ZinP7Qm3UAdegs246",
            "_blank",
            "noopener,noreferrer"
        );
    };

    const handlePrivacyClick = () => {
        window.open(
            "https://bronze-reaction-5e0.notion.site/112cba65465f80ab8588f91a4f65a458?pvs=4",
            "_blank",
            "noopener,noreferrer"
        );
    };

    const handleTermsClick = () => {
        window.open(
            "https://bronze-reaction-5e0.notion.site/112cba65465f80248052d4e4a5eee135?pvs=4",
            "_blank",
            "noopener,noreferrer"
        );
    };

    return (
        <div className="w-full mx-auto p-6 space-y-4 pc:px-[191px]">
            <Navbar />

            <div className="relative">
                <input
                    value={searchTerm}
                    onChange={handleSearchChange}
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
                                onClick={() => handleSongDetailClick(user)}
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
            <div className="fixed bottom-8 right-8 z-50">
                <button
                    onClick={handleFeedBackClick}
                    className="w-[110px] h-[110px] bg-black text-white rounded-full flex items-center justify-center text-base hover:bg-gray-800 transition-colors"
                >
                    의견 보내기
                </button>
            </div>
            <div className="w-full border-t border-gray-200 absolute left-0">
                <div className="flex flex-col items-center py-4 text-sm text-gray-500">
                    <div className="flex space-x-4 mb-2">
                        <span
                            onClick={handlePrivacyClick}
                            className="hover:text-gray-700 cursor-pointer"
                        >
                            개인정보처리방침
                        </span>
                        <span
                            onClick={handleTermsClick}
                            className="hover:text-gray-700 cursor-pointer"
                        >
                            이용약관
                        </span>
                        <span
                            onClick={handleInquiryClick}
                            className="hover:text-gray-700 cursor-pointer"
                        >
                            문의
                        </span>
                    </div>
                    <p className="text-xs">
                        Copyright 2024 Sing4U All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
