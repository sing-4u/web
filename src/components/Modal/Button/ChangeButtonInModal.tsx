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
            disabled={!isValid}
            className={`mt-8 w-full h-[52px] flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium ${
                !isValid
                    ? "bg-gray-300 cursor-not-allowed"
                    : buttonBackgroundColor
            } text-white hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        >
            {isLoading ? "변경 중" : "변경하기"}
        </button>
    );
};

export default ChangeButtonInModal;
