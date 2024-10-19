import { FormProvider, useForm } from "react-hook-form";
import Dialog, { DialogProps } from "./Dialog";
import axios from "axios";
import FormField from "../FormField";

const EmailDialog = ({ isOpen, onClose }: DialogProps) => {
    const methods = useForm({
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const onSubmit = async (data: { email: string; password: string }) => {
        const { email, password } = data;
        if (password === email) {
            methods.setError("password", {
                type: "custom",
                message: "비밀번호가 이메일과 동일합니다."
            });
            return;
        }
        try {
            await axios.patch(
                `${import.meta.env.VITE_API_URL}/users/me/email`,
                { email, password },
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
        <Dialog isOpen={isOpen} onClose={onClose} title="이메일 변경">
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                    <FormField
                        label="새 이메일"
                        name="email"
                        type="email"
                        placeholder="이메일을 입력하세요"
                        rules={{ required: "이메일을 입력해주세요" }}
                    />
                    <FormField
                        label="비밀번호"
                        name="password"
                        type="password"
                        placeholder="비밀번호를 입력하세요"
                        rules={{
                            required: "비밀번호를 입력해주세요",
                            pattern: {
                                value: /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/,
                                message:
                                    "비밀번호 취약: 비밀번호는 8~16자의 영문 대/소문자, 숫자, 특수문자를 모두 포함해야 합니다."
                            }
                        }}
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

export default EmailDialog;
