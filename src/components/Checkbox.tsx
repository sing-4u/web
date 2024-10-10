import React from "react";
import CheckboxOutline from "../../src/assets/_checkbox.png";
import CheckboxBlack from "../../src/assets/_checkbox_black.png";
import ChevronRight from "../../src/assets/icons-chevron_right.png";

interface CheckboxProps {
    label: string;
    isChecked: boolean;
    onToggle: () => void;
    onChevronClick?: () => void;
}

const Checkbox: React.FC<CheckboxProps> = ({
    label,
    isChecked,
    onToggle,
    onChevronClick
}) => {
    const handleCheckboxClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggle();
    };

    const handleChevronClick = (e: React.MouseEvent) => {
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
                    src={isChecked ? CheckboxBlack : CheckboxOutline}
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
