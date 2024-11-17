import { useEffect, useState } from "react";

export const useTitle = (initialTitle = "로딩 중...") => {
    const [title, setTitle] = useState(initialTitle);

    useEffect(() => {
        document.title = title;
    }, [title]);

    return setTitle;
};
