interface ToastProps {
    id: number;
    type: "success" | "error" | "warning" | "info";
    message: string;
}

export const ToastContainer = ({ toasts }: { toasts: ToastProps[] }) => {
    return (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 space-y-2 z-50">
            {toasts.map((toast) => (
                <Toast key={toast.id} {...toast} />
            ))}
        </div>
    );
};

const Toast = ({ type, message }: ToastProps) => {
    const bgColorClass = {
        success: "bg-green-500",
        error: "bg-red-500",
        warning: "bg-yellow-500",
        info: "bg-blue-500"
    }[type];

    return (
        <div
            className={`p-4 rounded-md text-white shadow-lg transition ${bgColorClass}`}
        >
            {message}
        </div>
    );
};
