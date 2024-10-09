import { BiChevronRight } from "react-icons/bi";
import CheckboxOutline from "../../src/assets/_checkbox.png";
import CheckboxBlack from "../../src/assets/_checkbox_black.png";

interface CheckboxProps {
    label: string;
    isChecked: boolean;
    onToggle: () => void;
}

const Checkbox = ({ label, isChecked, onToggle }: CheckboxProps) => (
    <div
        className="flex justify-between items-center space-x-2 cursor-pointer"
        onClick={onToggle}
    >
        {isChecked ? (
            <img src={CheckboxBlack} alt="" className="mr-1" />
        ) : (
            <img src={CheckboxOutline} alt="" className="mr-1" />
        )}
        <div className="flex w-screen justify-start">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {label}
            </label>
        </div>
        <BiChevronRight className="w-32 h-5" />
    </div>
);

export default Checkbox;
