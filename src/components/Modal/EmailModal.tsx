import { useForm } from "react-hook-form";
import getInputErrorClassName from "../../utils/className";
import usePasswordToggle from "../../hooks/usePasswordToggle";
import axiosInstance from "../../utils/axiosInstance";
import { useModal } from "../../hooks/useModal";

const EmailDialogContent = () => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: ""
        }
    });

    const { openModal } = useModal();

    const onSubmit = async (data: { email: string; password: string }) => {
        const { email, password } = data;

        try {
            axiosInstance.patch("/users/me/email", { email, password });
            openModal("changeEmail");
        } catch {
            // error handling
        }
    };

    const { passwordState, handleToggle, handleEyeIconToggle } =
        usePasswordToggle();

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    이메일
                </label>

                <div className="flex flex-col">
                    <input
                        {...register("email", {
                            required: "이메일은 필수값입니다.",
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: "올바른 이메일 형식이 아닙니다."
                            }
                        })}
                        type="email"
                        className={`mb-2 ${getInputErrorClassName(
                            errors.email
                        )}`}
                        placeholder="이메일을 입력해주세요."
                    />
                    {errors.email ? (
                        <p className="text-red-500">{errors.email.message}</p>
                    ) : null}
                </div>
            </div>

            <div>
                <label className="my-2 block text-sm font-medium text-gray-700">
                    비밀번호
                </label>
                <div className="relative">
                    <input
                        {...register("password", {
                            required: "비밀번호는 필수값입니다.",
                            pattern: {
                                value: /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/,
                                message:
                                    "비밀번호 취약: 비밀번호는 8~16자의 영문 대/소문자, 숫자, 특수문자를 모두 포함해야 합니다."
                            }
                        })}
                        type={passwordState.type}
                        className={`pr-10 w-full ${getInputErrorClassName(
                            errors.password
                        )}`}
                        placeholder="비밀번호를 입력해주세요."
                    />

                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={handleToggle}
                    >
                        <img
                            src={handleEyeIconToggle()}
                            alt="toggle password visibility"
                            className="h-5 w-5"
                        />
                    </button>
                </div>
                {errors.password ? (
                    <p className="text-red-500">{errors.password.message}</p>
                ) : null}
            </div>

            <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                변경하기
            </button>
        </form>
    );
};

export default EmailDialogContent;
