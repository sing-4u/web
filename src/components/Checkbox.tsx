import { MouseEvent } from "react";
import CheckboxOutline from "../../src/assets/_checkbox_outline.svg";
import CheckedBox from "../../src/assets/_checkbox_black.svg";
import ChevronRight from "../../src/assets/icons_chevron_right_m.svg";

interface CheckboxProps {
    label: string;
    isChecked: boolean;
    onToggle: () => void;
    onChevronClick?: () => void;
    type: "privacy" | "terms" | "age";
}

const Checkbox = ({
    label,
    isChecked,
    onToggle,
    onChevronClick,
    type
}: CheckboxProps) => {
    const handleChevronClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        let url = "";

        switch (type) {
            case "privacy":
                url =
                    "https://bronze-reaction-5e0.notion.site/112cba65465f80ab8588f91a4f65a458?pvs=4";
                break;
            case "terms":
                url =
                    "https://bronze-reaction-5e0.notion.site/112cba65465f80248052d4e4a5eee135?pvs=4";
                break;
            case "age":
                break;
        }

        if (url) {
            try {
                window.open(url, "_blank", "noopener,noreferrer");
            } catch (error) {
                console.error("Failed to open URL:", error);
                window.location.href = url;
            }
        }

        if (onChevronClick) {
            onChevronClick();
        }
    };

    return (
        <div className="flex justify-between items-center">
            <label className="flex items-center">
                <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={onToggle}
                    className="hidden cursor-pointer"
                    role="checkbox"
                    aria-checked={isChecked}
                />
                <img
                    src={isChecked ? CheckedBox : CheckboxOutline}
                    alt=""
                    className="w-5 h-5 mr-2 cursor-pointer"
                />
                <span className="text-sm leading-none mobile:font-normal mobile:text-[14px] tablet:text-[14px] pc:text-base">
                    {label}
                </span>
            </label>

            <button
                type="button"
                onClick={handleChevronClick}
                className="bg-transparent border-none cursor-pointer p-0"
                aria-label={`${label} 상세 정보 보기`}
            >
                <img
                    src={ChevronRight}
                    alt=""
                    className="mobile:w-[20px] mobile:h-[20px] tablet:w-[20px] tablet:h-[20px] pc:w-6 pc:h-6"
                />
            </button>
        </div>
    );
};

export default Checkbox;
