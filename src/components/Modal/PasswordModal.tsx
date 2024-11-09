import { useForm } from "react-hook-form";
import axiosInstance from "../../utils/axiosInstance";
import getInputErrorClassName from "../../utils/className";
import usePasswordToggle from "../../hooks/usePasswordToggle";
import { useToast } from "../../hooks/useToast";
import { ToastContainer } from "../ToastContainer";

const PasswordModalContent = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm({
        defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" }
    });

    const { showToast, toasts } = useToast();

    const watchPassword = watch("newPassword");
    const watchOldPassword = watch("oldPassword");

    const onSubmit = async (data: {
        oldPassword: string;
        newPassword: string;
        confirmPassword: string;
    }) => {
        const { oldPassword, newPassword } = data;
        try {
            await axiosInstance().patch("/users/me/password", {
                oldPassword,
                newPassword
            });
            showToast("success", "비밀번호 변경 완료");
        } catch {
            // error handling
        }
    };

    const {
        passwordState: oldPasswordState,
        handleToggle: handleOldToggle,
        handleEyeIconToggle: handleOldEyeIconToggle
    } = usePasswordToggle();

    const {
        passwordState: newPasswordState,
        handleToggle: handleNewToggle,
        handleEyeIconToggle: handleNewEyeIconToggle
    } = usePasswordToggle();

    const {
        passwordState: confirmPasswordState,
        handleToggle: handleConfirmToggle,
        handleEyeIconToggle: handleConfirmEyeIconToggle
    } = usePasswordToggle();

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-y-4 rounded-[10px]"
        >
            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    현재 비밀번호
                </label>
                <div className="relative">
                    <input
                        {...register("oldPassword", {
                            required: "비밀번호는 필수값입니다.",
                            pattern: {
                                value: /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/,
                                message:
                                    "비밀번호 취약: 비밀번호는 8~16자의 영문 대/소문자, 숫자, 특수문자를 모두 포함해야 합니다."
                            }
                        })}
                        type={oldPasswordState.type}
                        className={`w-full pr-10 rounded-[10px] border-inputBorderColor ${getInputErrorClassName(
                            errors.oldPassword
                        )}`}
                        placeholder="비밀번호 입력"
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={handleOldToggle}
                    >
                        <img
                            src={handleOldEyeIconToggle()}
                            alt="toggle password visibility"
                            className="h-5 w-5"
                        />
                    </button>
                </div>
                {errors.oldPassword && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.oldPassword.message}
                    </p>
                )}
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    새 비밀번호
                </label>
                <div className="relative">
                    <input
                        {...register("newPassword", {
                            required: "비밀번호는 필수값입니다.",
                            pattern: {
                                value: /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/,
                                message:
                                    "비밀번호 취약: 비밀번호는 8~16자의 영문 대/소문자, 숫자, 특수문자를 모두 포함해야 합니다."
                            },
                            validate: (value) =>
                                value !== watchOldPassword ||
                                "새 비밀번호와 현재 비밀번호가 일치합니다. 다시 확인해주세요."
                        })}
                        type={newPasswordState.type}
                        className={`w-full pr-10 rounded-[10px] border-inputBorderColor ${getInputErrorClassName(
                            errors.newPassword
                        )}`}
                        placeholder="새 비밀번호 입력"
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={handleNewToggle}
                    >
                        <img
                            src={handleNewEyeIconToggle()}
                            alt="toggle password visibility"
                            className="h-5 w-5"
                        />
                    </button>
                </div>
                {errors.newPassword && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.newPassword.message}
                    </p>
                )}
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    새 비밀번호 확인
                </label>
                <div className="relative">
                    <input
                        {...register("confirmPassword", {
                            required: "비밀번호는 필수값입니다.",
                            validate: (value) =>
                                value === watchPassword ||
                                "비밀번호가 일치하지 않습니다."
                        })}
                        type={confirmPasswordState.type}
                        className={`w-full pr-10 rounded-[10px] border-inputBorderColor ${getInputErrorClassName(
                            errors.confirmPassword
                        )}`}
                        placeholder="새 비밀번호 확인"
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={handleConfirmToggle}
                    >
                        <img
                            src={handleConfirmEyeIconToggle()}
                            alt="toggle password visibility"
                            className="h-5 w-5"
                        />
                    </button>
                </div>
                {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.confirmPassword.message}
                    </p>
                )}
            </div>

            <button
                type="submit"
                className="mt-8 w-full h-[52px] flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-colorPurple hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                변경하기
            </button>
            <ToastContainer toasts={toasts} />
        </form>
    );
};

export default PasswordModalContent;
