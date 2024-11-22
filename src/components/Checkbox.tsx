import { MouseEvent } from "react";
import CheckboxOutline from "../../src/assets/_checkbox_outline.svg";
import CheckedBox from "../../src/assets/_checkbox_black.svg";
import ChevronRight from "../../src/assets/icons_chevron_right_m.svg";

interface CheckboxProps {
    label: string;
    isChecked: boolean;
    onToggle: () => void;
    onChevronClick?: () => void;
}

const Checkbox = ({
    label,
    isChecked,
    onToggle,
    onChevronClick
}: CheckboxProps) => {
    const handleChevronClick = (e: MouseEvent) => {
        e.stopPropagation();
        if (onChevronClick) {
            onChevronClick();
        }
    };

    return (
        <div className="flex justify-between items-center">
            <label className="flex items-center cursor-pointer">
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
                <span className="text-sm font-medium leading-none">
                    {label}
                </span>
            </label>
            <img
                src={ChevronRight}
                alt="chevron"
                className="w-5 h-5 cursor-pointer"
                onClick={handleChevronClick}
            />
        </div>
    );
};

export default Checkbox;
