interface ToastProps {
    id: number;
    type: "success" | "error" | "warning" | "info";
    message: string;
}

export const ToastContainer = ({ toasts }: { toasts: ToastProps[] }) => {
    return (
        <div className="fixed top-4 right-[40%] space-y-2 z-50">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`p-4 rounded-md text-white shadow-lg transition animate-bounceIn ${
                        toast.type === "success"
                            ? "bg-green-500"
                            : toast.type === "error"
                            ? "bg-red-500"
                            : toast.type === "warning"
                            ? "bg-yellow-500"
                            : "bg-blue-500"
                    }`}
                >
                    {toast.message}
                </div>
            ))}
        </div>
    );
};
