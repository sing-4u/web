import { BiChevronRight } from "react-icons/bi";
import { IoCheckbox, IoCheckboxOutline } from "react-icons/io5";

interface CheckboxProps {
    label: string;
    isChecked: boolean;
    onToggle: () => void;
}

const Checkbox = ({ label, isChecked, onToggle }: CheckboxProps) => (
    <div
        className="flex justify-start items-center space-x-2 cursor-pointer"
        onClick={onToggle}
    >
        {isChecked ? (
            <IoCheckbox size="24" className="rounded-md" />
        ) : (
            <IoCheckboxOutline size="24" />
        )}
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
        </label>
        <BiChevronRight className="relative right-1" size="24" />
    </div>
);

export default Checkbox;
