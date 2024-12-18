import { useState, useEffect, useRef, useCallback } from "react";
import SearchIcon from "../assets/ic_Search.svg";
import Card from "../assets/card.svg";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useTitle } from "../hooks/useTitle";
import axiosInstance from "../utils/axiosInstance";
import { baseURL } from "../utils/apiUrl";
import Footer from "../components/Footer";
import { useToast } from "../hooks/useToast";
import { ToastContainer } from "../components/ToastContainer";
import ClearButton from "../assets/ic_closeFill.svg";
import DefaultImgProfile from "../assets/img_profile_default_L.svg";

interface UserProps {
  id: string;
  name: string;
  image: string;
  isOpened: boolean;
}

export default function Home() {
  const { showToast, toasts } = useToast();
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
            name: keyword,
          },
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
          index: 0,
        },
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
          index: page,
        },
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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("showToast") === "passwordChanged") {
      showToast("success", "비밀번호가 성공적으로 변경되었습니다.");
    }
  }, []);

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
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !loading && hasMore) {
          loadMoreItems();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      }
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
          isOpened: user.isOpened,
        },
      },
    });
  };

  const handleFeedBackClick = () => {
    window.open(
      "https://forms.gle/a2PgcpA7De8UxQp17",
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const commentButtonClass =
    "mobile:w-[72px] mobile:h-[72px] mobile:py-[26px] mobile:px-[10px] mobile:text-[10px] mobile:font-semibold mobile:leading-[11.93px] bg-black text-white rounded-full flex items-center justify-center text-base hover:bg-gray-800 transition-colors";

  return (
    <div className="w-full max-w-[1920px]">
      <ToastContainer toasts={toasts} />
      <Navbar />
      <div className="relative pc:px-[191px] mobile:px-6 tablet:px-[46px] mobile:mt-4 pc:mt-8 tablet:mt-8">
        <input
          value={searchTerm}
          onChange={handleSearchChange}
          type="text"
          placeholder="아티스트명을 검색해주세요"
          className="w-full border h-14 rounded-[10px] pl-[60px]"
        />
        <img
          src={SearchIcon}
          alt="Search Icon"
          className="absolute left-[215px] mobile:left-[46px] tablet:left-[70px] top-1/2 transform -translate-y-1/2 w-6 h-6"
        />
        {searchTerm && (
          <button
            onClick={handleClearSearch}
            className="absolute right-[215px] mobile:right-[46px] tablet:right-[70px] top-1/2 transform -translate-y-1/2 w-6 h-6"
          >
            <img
              src={ClearButton}
              alt="Clear Search"
              className="w-full h-full"
            />
          </button>
        )}
      </div>
      <div className="grid mobile:grid-cols-2 w-full gap-4 pc:grid-cols-4 tablet:grid-cols-3 pc:px-[191px] mobile:px-6 mobile:mt-4 tablet:mt-8 pc:mt-8 tablet:px-[46px]">
        {users.map((user, index) => (
          <div key={`${user.id}_${index}`} className="flex flex-col">
            {user?.isOpened ? (
              <div className="relative rounded-[20px]">
                <div className="absolute inset-0 bg-gradient-to-r from-[#7B92C7] via-[#7846DD] to-[#BB7FA0] rounded-[20px]" />
                <div className="relative mobile:m-[6px] tablet:m-[6px] pc:m-[4px] bg-white rounded-[16px]">
                  <div
                    className="relative aspect-square w-full"
                    onClick={() => handleSongDetailClick(user)}
                  >
                    <img
                      src={user.image || DefaultImgProfile}
                      alt={`${user.name}의 프로필 이미지`}
                      className="w-full h-full object-cover rounded-[12px] cursor-pointer"
                    />
                    <div className="font-pretendard absolute top-2 left-2 bg-gradient-to-r from-[#7B92C7] via-[#7846DD] to-[#BB7FA0] text-white mobile:text-[10px] pc:text-xs tablet:text-xs mobile:leading-[11.93px] tablet:leading-[11.93px] pc:leading-[14.32px] font-bold py-2 px-[14px] rounded-[4px]">
                      신청곡 받는 중
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative rounded-[20px]">
                <div className="absolute inset-0 mobile:border-[6px] tablet:border-[6px] pc:border-[4px] border-inputBorderColor rounded-[20px]" />
                <div className="relative m-[8px] bg-white rounded-[8px]">
                  <div
                    className="relative aspect-square w-full"
                    onClick={() => handleSongDetailClick(user)}
                  >
                    <img
                      src={user.image || DefaultImgProfile}
                      alt={`${user.name}의 프로필 이미지`}
                      className="w-full h-full object-cover rounded-[12px] cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}
            <span className="mt-2 text-center font-bold">{user.name}</span>
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
      <div className="fixed mobile:bottom-8 pc:bottom-14 tablet:bottom-14 pc:right-12 mobile:right-8 tablet:right-7 z-50">
        <button
          onClick={handleFeedBackClick}
          className={`${commentButtonClass} mobile:w-[72px] mobile:h-[72px] pc:w-[110px] pc:h-[110px] tablet:w-[110px] tablet:h-[110px] bg-black text-white rounded-full flex items-center justify-center text-base hover:bg-gray-800 transition-colors`}
        >
          의견 보내기
        </button>
      </div>
      <Footer />
    </div>
  );
}
