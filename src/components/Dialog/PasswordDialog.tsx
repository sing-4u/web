import { FormProvider, useForm } from "react-hook-form";
import Dialog, { DialogProps } from "./Dialog";
import axios from "axios";
import FormField from "../FormField";

const PasswordDialog = ({ isOpen, onClose }: DialogProps) => {
    const methods = useForm({
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: ""
        }
    });

    const onSubmit = async (data: {
        oldPassword: string;
        newPassword: string;
        confirmPassword: string;
    }) => {
        const { oldPassword, newPassword, confirmPassword } = data;
        if (newPassword !== confirmPassword) {
            methods.setError("confirmPassword", {
                type: "custom",
                message: "새 비밀번호가 일치하지 않습니다."
            });
            return;
        }
        if (newPassword === oldPassword) {
            methods.setError("newPassword", {
                type: "custom",
                message: "새 비밀번호가 현재 비밀번호와 동일합니다."
            });
            return;
        }
        try {
            await axios.patch(
                `${import.meta.env.VITE_API_URL}/users/me/password`,
                { oldPassword, newPassword },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "accessToken"
                        )}`
                    }
                }
            );
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose} title="비밀번호 변경">
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                    <FormField
                        label="현재 비밀번호"
                        name="oldPassword"
                        type="password"
                        placeholder="현재 비밀번호 입력"
                        rules={{ required: "현재 비밀번호를 입력해주세요" }}
                    />
                    <FormField
                        label="새 비밀번호"
                        name="newPassword"
                        type="password"
                        placeholder="새 비밀번호 입력"
                        rules={{
                            required: "새 비밀번호를 입력해주세요",
                            pattern: {
                                value: /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/,
                                message:
                                    "비밀번호 취약: 비밀번호는 8~16자의 영문 대/소문자, 숫자, 특수문자를 모두 포함해야 합니다."
                            }
                        }}
                    />
                    <FormField
                        label="새 비밀번호 확인"
                        name="confirmPassword"
                        type="password"
                        placeholder="새 비밀번호 확인"
                        rules={{ required: "새 비밀번호를 다시 입력해주세요" }}
                    />
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        변경하기
                    </button>
                </form>
            </FormProvider>
        </Dialog>
    );
};

export default PasswordDialog;
