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
    const handleCheckboxClick = (e: MouseEvent) => {
        e.stopPropagation();
        onToggle();
    };
    console.log(isChecked, "isChecked");
    const handleChevronClick = (e: MouseEvent) => {
        e.stopPropagation();
        if (onChevronClick) {
            onChevronClick();
        }
    };

    return (
        <div className="flex justify-between items-center space-x-2">
            <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={handleCheckboxClick}
            >
                <img
                    src={isChecked ? CheckedBox : CheckboxOutline}
                    alt=""
                    className="mr-1"
                />
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {label}
                </label>
            </div>
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
