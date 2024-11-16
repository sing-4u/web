import React, { useState, useRef, useEffect } from "react";

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

const PullToRefreshComponent: React.FC<PullToRefreshProps> = ({
  onRefresh,
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [startY, setStartY] = useState<number | null>(null);
  const [currentY, setCurrentY] = useState<number | null>(null);
  const [refreshHeight, setRefreshHeight] = useState(0); // Pull-to-refresh 이동 범위
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (containerRef.current && containerRef.current.scrollTop === 0) {
        setStartY(e.touches[0].clientY);
        setRefreshHeight(0); // 새로 시작할 때 초기화
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (startY !== null) {
        const deltaY = e.touches[0].clientY - startY;
        if (deltaY > 0) {
          setCurrentY(e.touches[0].clientY);
          setRefreshHeight(deltaY); // 이동한 거리 저장
        }
      }
    };

    const handleTouchEnd = async () => {
      if (startY !== null && currentY !== null && refreshHeight > 50) {
        setIsLoading(true);
        setRefreshHeight(50); // 로딩 중일 때 고정 높이 설정
        await onRefresh();
        setIsLoading(false);
        setRefreshHeight(0); // 초기화
      } else {
        setRefreshHeight(0); // 초기화
      }
      setStartY(null);
      setCurrentY(null);
    };

    const container = containerRef.current;
    container?.addEventListener("touchstart", handleTouchStart);
    container?.addEventListener("touchmove", handleTouchMove);
    container?.addEventListener("touchend", handleTouchEnd);

    return () => {
      container?.removeEventListener("touchstart", handleTouchStart);
      container?.removeEventListener("touchmove", handleTouchMove);
      container?.removeEventListener("touchend", handleTouchEnd);
    };
  }, [startY, currentY, refreshHeight, onRefresh]);

  return (
    <div ref={containerRef} className="relative overflow-auto h-full">
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-center bg-gray-200"
        style={{ height: `${refreshHeight}px`, transition: "height 0.3s" }}
      >
        {isLoading && <div className="text-center">로딩중...</div>}
      </div>
      {children}
    </div>
  );
};

export default PullToRefreshComponent;
