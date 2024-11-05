const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: "2-digit",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("ko-KR", options);
};

export default formatDate;
