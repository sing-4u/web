import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { GoogleOAuthProvider } from "@react-oauth/google";

interface LoginFormValue {
  email: string;
  password: string;
}

interface LoginState {
  loading: boolean;
  error: string | null;
  accessToken: string | null;
}

const Login = () => {
  const { register, handleSubmit } = useForm<LoginFormValue>();
  const [loginstate, setLoginState] = useState<LoginState>({
    loading: false,
    error: null,
    accessToken: null,
  });

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const FetchLogin = async (email: string, password: string) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/auth/login/email`,
      { email, password }
    );
    return response.data;
  };

  const onSubmit = async (data: LoginFormValue) => {
    setLoginState({ loading: true, error: null, accessToken: null });

    try {
      const response = await FetchLogin(data.email, data.password);
      const { accessToken, refreshToken } = response;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      setLoginState({ loading: false, error: null, accessToken });
      navigate(from, { replace: true });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setLoginState({
          loading: false,
          error: "존재하지 않는 유저입니다.",
          accessToken: null,
        });
      }
    }
  };

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

    if (authCode) {
      const processGoogleLogin = async () => {
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/auth/login/social`,
            {
              provider: "GOOGLE",
              providerCode: authCode,
            }
          );
          console.log(response);
          const { accessToken, refreshToken } = response.data;
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          setLoginState({ loading: false, error: null, accessToken });
          navigate(from, { replace: true });
        } catch (error) {
          setLoginState({
            loading: false,
            error: "Google 로그인에 실패했습니다.",
            accessToken: null,
          });
        }
      };

      processGoogleLogin();
    }
  }, [navigate, from]);

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
              onClick={initiateGoogleLogin}
              className="w-full h-full flex items-center justify-center font-bold text-[14px] leading-[16.71px] cursor-pointer"
            >
              Google로 계속하기
            </button>
          </div>
          <div className="absolute w-[250px] h-[12px] top-[372px] left-[63px] text-center font-normal text-[10px] leading-[11.93px] text-customGray">
            또는
          </div>
          <div className="flex flex-col">
            <input
              className="absolute w-[327px] h-[52px] top-[432px] left-[24px] border border-customGray rounded-[10px] text-left placeholder:text-[14px] placeholder:leading-[24px] placeholder:pt-[14px] pl-[24px]"
              {...register("email", { required: "이메일을 입력해주세요" })}
              maxLength={20}
              type="text"
              placeholder="이메일 주소"
            />
            <input
              className="absolute w-[327px] h-[52px] top-[490px] left-[24px] border border-customGray rounded-[10px] text-left placeholder:text-[14px] placeholder:leading-[24px] placeholder:pt-[14px] pl-[24px]"
              {...register("password", { required: "비밀번호를 입력해주세요" })}
              type="password"
              placeholder="비밀번호"
            />
          </div>
          <div className="flex justify-center">
            <button
              className="absolute w-[327px] h-[52px] top-[558px] left-[24px] border bg-black text-white rounded-[10px]"
              type="submit"
              disabled={loginstate.loading}
            >
              {loginstate.loading ? "로그인 중..." : "로그인"}
            </button>
          </div>
          <div className="flex flex-col items-center w-[245px] h-[24px] top-[615px] left-[65px] absolute">
            <div className="flex items-center space-x-4">
              <div className="font-medium text-[14px] leading-[24px] text-customGray cursor-pointer">
                회원가입
              </div>
              <div className="h-[14px] border border-customGray opacity-30"></div>
              <div className="font-medium text-[14px] leading-[24px] text-customGray cursor-pointer">
                계정 찾기
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
