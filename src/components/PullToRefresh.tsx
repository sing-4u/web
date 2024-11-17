import React from "react";
import PullToRefresh from "react-simple-pull-to-refresh";

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

const PullToRefreshComponent: React.FC<PullToRefreshProps> = ({
  onRefresh,
  children,
}) => {
  const handleRefresh = async () => {
    await onRefresh();
  };

  return (
    <PullToRefresh
      onRefresh={handleRefresh}
      pullDownThreshold={50}
      maxPullDownDistance={100}
      resistance={2.5}
      refreshingContent={<div>로딩중...</div>}
      pullingContent={<div className="text-center">당겨서 새로고침</div>}
    >
      <div className="relative overflow-auto h-full">{children}</div>
    </PullToRefresh>
  );
};

export default PullToRefreshComponent;
