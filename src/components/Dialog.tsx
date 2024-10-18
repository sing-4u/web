const Dialog = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-[328px]">
                <h2 className="text-lg font-bold mb-4">{title}</h2>
                {children}
                <button
                    onClick={onClose}
                    className="mt-4 w-full bg-black text-white py-2 rounded"
                >
                    닫기
                </button>
            </div>
        </div>
    );
};

export default Dialog;
