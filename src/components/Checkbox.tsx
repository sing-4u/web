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
    const handleChevronClick = (e: MouseEvent) => {
        e.stopPropagation();
        let url = "";
        if (type === "privacy") {
            url =
                "https://bronze-reaction-5e0.notion.site/112cba65465f80ab8588f91a4f65a458?pvs=4";
        } else if (type === "terms") {
            url =
                "https://bronze-reaction-5e0.notion.site/112cba65465f80248052d4e4a5eee135?pvs=4";
        }
        if (url) {
            window.open(url, "_blank");
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
                    className="hidden"
                />
                <img
                    src={isChecked ? CheckedBox : CheckboxOutline}
                    alt=""
                    className="w-5 h-5 mr-2"
                />
                <span className="text-sm leading-none font-bold">{label}</span>
            </label>
            {
                <a href="">
                    <img
                        src={ChevronRight}
                        alt="chevron"
                        className="w-5 h-5"
                        onClick={handleChevronClick}
                    />
                </a>
            }
        </div>
    );
};

export default Checkbox;
