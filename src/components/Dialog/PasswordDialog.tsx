import { useForm } from "react-hook-form";
import Dialog, { DialogProps } from "./Dialog";
import getInputErrorClassName from "../../utils/className";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

const PasswordDialog = ({ isOpen, onClose }: DialogProps) => {
    // const methods = useForm({
    //     defaultValues: {
    //         oldPassword: "",
    //         newPassword: "",
    //         confirmPassword: ""
    //     }
    // });

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset
    } = useForm({
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: ""
        }
    });

    useEffect(() => {
        if (isOpen) {
            reset();
            setCompleteChangePassword(false);
        }
    }, [isOpen, reset]);

    const [completChangePassword, setCompleteChangePassword] = useState(false);

    const watchPassword = watch("newPassword");
    const watchOldPassword = watch("oldPassword");

    const onSubmit = async (data: {
        oldPassword: string;
        newPassword: string;
        confirmPassword: string;
    }) => {
        const { oldPassword, newPassword } = data;

        try {
            axiosInstance.patch("/users/me/password", {
                oldPassword,
                newPassword
            });
            onClose();
            setCompleteChangePassword(true);
        } catch {
            // error handling
        }
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose} title="비밀번호 변경">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        현재 비밀번호
                    </label>
                    <div className="flex flex-col">
                        <input
                            {...register("oldPassword", {
                                required: "비밀번호는 필수값입니다.",
                                pattern: {
                                    value: /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/,
                                    message:
                                        "비밀번호 취약: 비밀번호는 8~16자의 영문 대/소문자, 숫자, 특수문자를 모두 포함해야 합니다."
                                }
                            })}
                            type="password"
                            className={`mb-2 ${getInputErrorClassName(
                                errors.oldPassword
                            )}`}
                            placeholder="비밀번호를 입력해주세요."
                        />
                        {errors.oldPassword ? (
                            <p className="text-red-500">
                                {errors.oldPassword.message}
                            </p>
                        ) : null}
                    </div>
                </div>
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        새 비밀번호
                    </label>
                    <div className="flex flex-col">
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
                            type="password"
                            className={`mb-2 ${getInputErrorClassName(
                                errors.newPassword
                            )}`}
                            placeholder="새 비밀번호를 입력해주세요."
                        />
                        {errors.newPassword && (
                            <p className="text-red-500">
                                {errors.newPassword.message}
                            </p>
                        )}
                    </div>
                </div>
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        새 비밀번호 확인
                    </label>
                    <div className="flex flex-col">
                        <input
                            {...register("confirmPassword", {
                                required: "비밀번호는 필수값입니다.",
                                pattern: {
                                    value: /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/,
                                    message:
                                        "비밀번호 취약: 비밀번호는 8~16자의 영문 대/소문자, 숫자, 특수문자를 모두 포함해야 합니다."
                                },
                                validate: (value) =>
                                    value === watchPassword ||
                                    "비밀번호가 일치하지 않습니다."
                            })}
                            type="password"
                            className={`mb-2 ${getInputErrorClassName(
                                errors.confirmPassword
                            )}`}
                            placeholder="새 비밀번호를 다시 입력해주세요."
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-500">
                                {errors.confirmPassword.message?.toString()}
                            </p>
                        )}
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    변경하기
                </button>
                {/* TODO : 추후에 다이얼로그 추가 예정 */}
                {completChangePassword ? "비밀번호 변경 완료" : null}
            </form>
        </Dialog>
    );
};

export default PasswordDialog;
