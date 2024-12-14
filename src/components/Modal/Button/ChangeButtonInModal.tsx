interface ChangeButtonProps {
    isLoading: boolean;
    isValid: boolean;
    buttonBackgroundColor: string;
}

const ChangeButtonInModal = ({
    isLoading,
    isValid,
    buttonBackgroundColor
}: ChangeButtonProps) => {
    return (
        <button
            type="submit"
            disabled={isValid}
            className={`mobile:font-bold pc:font-bold mobile:text-[14px] pc:text-base tablet:font-bold mt-8 w-full h-[52px] flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold ${
                isValid
                    ? "bg-gray-300 cursor-not-allowed"
                    : buttonBackgroundColor
            } text-white hover:bg-colorPurpleHover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        >
            {isLoading ? "변경 중" : "변경하기"}
        </button>
    );
};

export default ChangeButtonInModal;
