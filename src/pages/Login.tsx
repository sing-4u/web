import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useMutation, useQuery } from "@tanstack/react-query";
import { checkAuth } from "../utils/Auth";
import GoogleIcon from "../components/GoogleIcon";

interface LoginFormValue {
  email: string;
  password: string;
}

interface LoginState {
  loading: boolean;
  error: string | null;
}

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValue>();
  const [loginState, setLoginState] = useState<LoginState>({
    loading: false,
    error: null,
  });

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormValue) => {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login/email`,
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      const { accessToken, refreshToken } = data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      navigate(from, { replace: true });
    },
    onError: (error: any) => {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setLoginState({
          loading: false,
          error: "존재하지 않는 유저입니다.",
        });
      } else if (error.response?.status === 401) {
        setLoginState({
          loading: false,
          error: "비밀번호가 일치하지 않습니다.",
        });
      } else {
        setLoginState({
          loading: false,
          error: "이메일이나 비밀번호를 확인해주세요.",
        });
      }
    },
  });

  const initiateGoogleLogin = async () => {
    const googleAuthEndpoint = "https://accounts.google.com/o/oauth2/v2/auth";

    const queryParams = new URLSearchParams({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URI,
      response_type: "code",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ].join(" "),
      include_granted_scopes: "true",
    });

    window.location.href = `${googleAuthEndpoint}?${queryParams.toString()}`;
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get("code");
    console.log(window.location.href);
    const processGoogleLogin = async (authCode: string) => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/login/social`,
          {
            provider: "GOOGLE",
            providerCode: authCode,
          }
        );
        const { accessToken, refreshToken } = response.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        navigate(from, { replace: true });
      } catch (error) {
        setLoginState({
          loading: false,
          error: "Google 로그인에 실패했습니다.",
        });
      }
    };
    if (authCode) {
      processGoogleLogin(authCode);
    } else if (!authCode) {
      console.log("NO AUTH CODE");
    }
  }, [location.search, navigate, from]);

  const { data: isAuthenticated } = useQuery({
    queryFn: checkAuth,
    queryKey: ["checkAuth"],
  });

  const onSubmit = (data: LoginFormValue) => {
    setLoginState({ loading: true, error: null });
    loginMutation.mutate(data);
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ""}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full max-w-md mx-auto p-6 space-y-6 h-full relative">
          <div className="absolute w-[118] h-[38px] top-[137px] left-[129px] font-bold text-[34px] leading-[38px] text-center">
            <div>Sing4U</div>
          </div>
          <div className="absolute w-[326px] h-[22px] top-[193px] left-[25px] font-medium text-[13px] leading-[22px] text-center">
            지금 가입하면, 당신의 신청곡으로 특별한 노래를 선물해드릴게요
          </div>
          <div className="space-x-2 mt-4 flex items-center">
            <span className="w-full border-b"></span>
          </div>
          <div className="absolute w-[327px] h-[52px] top-[293px] left-[24px] rounded-[10px] border border-black flex items-center justify-center">
            <button
              type="button"
              onClick={initiateGoogleLogin}
              className="w-full h-full flex items-center justify-center font-bold text-[14px] leading-[16.71px] cursor-pointer"
            >
              <GoogleIcon />
              <span className="ml-2">Google로 계속하기</span>{" "}
            </button>
          </div>
          <div className="absolute w-[250px] h-[12px] top-[372px] left-[63px] text-center font-normal text-[10px] leading-[11.93px] text-customGray">
            또는
          </div>
          <div className="flex flex-col space-y-4 ">
            <div
              className={`relative w-[327px] top-[365px]  ${
                errors.email ? "mb-4" : "mb-0"
              }`}
            >
              <input
                className={`w-[327px] h-[52px] border border-inputBorderColor text-[#AAAAA] ${
                  errors.email ? "border-red-500" : "border-customGray"
                } 
                  rounded-[10px] text-left placeholder:text-[14px] placeholder:leading-[24px] 
                  placeholder:pt-[14px] pl-[24px]`}
                {...register("email", { required: "이메일을 입력해주세요" })}
                maxLength={20}
                type="text"
                placeholder="이메일 주소"
              />
              {errors.email && (
                <span className="text-red-500 text-[12px] leading-[14.32px] absolute top-[56px] left-0">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div
              className={`relative w-[327px] top-[360px] ${
                errors.password ? "mb-4" : "mb-0"
              }`}
            >
              <input
                className={`w-full h-[52px] border border-inputBorderColor text-[#AAAAA] ${
                  errors.password ? "border-red-500" : "border-customGray"
                } 
                  rounded-[10px] text-left placeholder:text-[14px] placeholder:leading-[24px] 
                  placeholder:pt-[14px] pl-[24px]`}
                {...register("password", {
                  required: "비밀번호를 입력해주세요",
                })}
                type="password"
                placeholder="비밀번호"
              />
              {errors.password && (
                <span className="text-red-500 text-[12px] leading-[14.32px] absolute top-[56px] left-0">
                  {errors.password.message}
                </span>
              )}
            </div>
          </div>
          <div className="flex justify-center">
            <button
              className="absolute w-[327px] h-[52px] top-[600px] left-[24px] border bg-black text-white rounded-[10px]"
              type="submit"
              disabled={loginState.loading}
            >
              {loginState.loading ? "로그인 중..." : "로그인"}
            </button>
          </div>
          {loginState.error && (
            <div className="absolute w-[176px] top-[393px] left-[100px] text-red-500 text-center mt-4 font-medium text-[12px] leading-[14.32px]">
              {loginState.error}
            </div>
          )}
          <div className="flex flex-col items-center w-[245px] h-[24px] top-[615px] left-[65px] absolute">
            <div className="flex items-center space-x-4 mt-6">
              <div
                className="font-medium text-[14px] leading-[24px] text-customGray cursor-pointer"
                onClick={() => navigate("/Join")}
              >
                회원가입
              </div>
              <div className="h-[14px] border border-customGray opacity-30"></div>
              <div className="font-medium text-[14px] leading-[24px] text-customGray cursor-pointer">
                비밀번호 찾기
              </div>
            </div>
          </div>
        </div>
      </form>
    </GoogleOAuthProvider>
  );
};

export default Login;
