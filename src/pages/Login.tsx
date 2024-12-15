import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useMutation, useQuery } from "@tanstack/react-query";
import { checkAuth } from "../utils/Auth";
import GoogleIcon from "../components/GoogleIcon";
import storeToken from "../utils/storeToken";
import Logo from "../components/Logo";
import { baseURL } from "../utils/apiUrl";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "./Join";
import usePasswordToggle from "../hooks/usePasswordToggle";
import LoginTooltip from "../assets/LoginTooltip.svg";
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
      storeToken(accessToken, refreshToken);
      navigate(from, { replace: true });
    },
    onError: (error: AxiosError) => {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setLoginState({
          loading: false,
          error: "이메일이나 비밀번호를 확인해주세요.",
        });
      } else if (error.response?.status === 401) {
        setLoginState({
          loading: false,
          error: "이메일이나 비밀번호를 확인해주세요.",
        });
      } else {
        setLoginState({
          loading: false,
          error: "이메일이나 비밀번호를 확인해주세요.",
        });
      }
    },
  });

  const {
    passwordState: password,
    handleToggle,
    handleEyeIconToggle,
  } = usePasswordToggle();

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
    const saveAccessToken = async () => {
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get("access_token");

      if (accessToken) {
        localStorage.setItem("providerAccessToken", accessToken);
        return accessToken;
      }
      return null;
    };

    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get("code");
    console.log(window.location.href);
    const processGoogleLogin = async () => {
      try {
        const providerAccessToken = await saveAccessToken();
        console.log("providerAccessToken: ", providerAccessToken);
        // const response = await axios.post(
        //     `${import.meta.env.VITE_API_URL}/auth/login/social`,
        //     {
        //         provider: "GOOGLE",
        //         providerCode: authCode
        //     }
        // );
        // const { accessToken, refreshToken } = response.data;
        // localStorage.setItem("accessToken", accessToken);
        // localStorage.setItem("refreshToken", refreshToken);
        // navigate(from, { replace: true });
        if (providerAccessToken) {
          const response = await axios.post(`${baseURL}/auth/login/social`, {
            provider: "GOOGLE",
            providerAccessToken,
          });

          const { accessToken, refreshToken } = response.data;
          const decodedToken = jwtDecode<DecodedToken>(accessToken);

          localStorage.setItem(
            "userInfo",
            JSON.stringify({
              email: decodedToken.email,
              provider: decodedToken.provider,
            })
          );

          storeToken(accessToken, refreshToken);
          navigate(from, { replace: true });
        }
      } catch (error) {
        console.error("Google 로그인 처리 중 오류 발생:", error);
        setLoginState({
          loading: false,
          error: "Google 로그인에 실패했습니다.",
        });
      }
    };
    if (window.location.hash) {
      processGoogleLogin();
    }

    // if (authCode) {
    //     processGoogleLogin(authCode);
    // }
  }, [location.search, navigate, from]);

  const { data: isAuthenticated } = useQuery({
    queryFn: checkAuth,
    queryKey: ["checkAuth"],
  });

  const onSubmit = (data: LoginFormValue) => {
    setLoginState({ loading: true, error: null });
    loginMutation.mutate(data);
  };

  const handleFindPasswordPage = () => {
    navigate("/find-password");
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ""}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div
          className="w-full max-w-md mx-auto p-6 space-y-6 h-full relative mobile:w-[375px]
  pc:w-[380px] pc:h-[601px]"
        >
          <div className=" absolute w-[100px] h-[35.15px] top-[125px] left-[138px] font-bold text-[34px] leading-[38px] text-center">
            <div
              onClick={() => {
                navigate("/");
              }}
              className="cursor-pointer flex justify-center items-center w-[100px] h-[35.15px]"
            >
              <Logo />
            </div>
          </div>
          <div className="absolute w-[326px] h-[22px] top-[181px] left-[25px] font-medium text-[13px] leading-[22px] text-center">
            지금 가입하면, 당신의 신청곡으로 특별한 노래를 선물해드릴게요
          </div>
          <div className="space-x-2 mt-4 flex items-center"></div>
          <div className="absolute w-[327px] h-[52px] top-[278px] left-[24px] rounded-[10px] border border-black flex items-center justify-center">
            {/* <button
                            type="button"
                            onClick={initiateGoogleLogin}
                            className="w-full h-full flex items-center justify-center font-bold text-[14px] leading-[16.71px] cursor-pointer"
                        >
                            <GoogleIcon />
                            <span className="ml-2">Google로 계속하기</span>{" "}
                        </button> */}
            <a
              href={`https://accounts.google.com/o/oauth2/auth?client_id=${
                import.meta.env.VITE_GOOGLE_CLIENT_ID
              }&redirect_uri=${
                import.meta.env.VITE_GOOGLE_REDIRECT_URI
              }&response_type=token&scope=https://www.googleapis.com/auth/userinfo.email`}
              className="w-full h-full flex items-center justify-center font-bold text-sm"
            >
              <GoogleIcon />
              <span className="ml-2">Google로 회원가입</span>
            </a>
            <img
              src={LoginTooltip}
              alt="Google Login Tooltip"
              className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full z-50 transition-all duration-300 animate-fadeIn"
            />
          </div>
          <div className="absolute w-[250px] h-[12px] top-[366px] left-[63px] text-center font-normal text-[10px] leading-[11.93px] text-customGray">
            또는
          </div>
          <div className="flex flex-col space-y-4 ">
            <div
              className={`relative w-[327px] top-[365px]  ${
                errors.email ? "mb-4" : "mb-0"
              }`}
            >
              <input
                className={`w-[327px] h-[52px] border border-inputBorderColor box-border text-[#AAAAA] ${
                  errors.email ? "border-red-500" : "border-customGray"
                }
                  rounded-[10px] text-left placeholder:text-[14px] placeholder:leading-[24px]
                  placeholder:pt-[14px] pl-[24px]`}
                {...register("email", {
                  required: "이메일을 입력해주세요.",
                })}
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
                type={password.type}
                placeholder="비밀번호"
              />
              <button
                type="button"
                onClick={handleToggle}
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
              >
                <img src={handleEyeIconToggle()} className="w-5 h-5" />
              </button>
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
            <div className="absolute w-[176px] top-[390px] left-[100px] box-border text-red-500 text-center mt-4 font-medium text-[12px] leading-[14.32px] whitespace-nowrap">
              {loginState.error}
            </div>
          )}
          <div className="flex flex-col items-center w-[245px] h-[24px] top-[620px] mobile:top-[620.5px] left-[65px] absolute">
            <div className="flex items-center space-x-4 mt-6">
              <div
                className="font-medium text-[14px] leading-[24px] text-customGray cursor-pointer"
                onClick={() => navigate("/join")}
              >
                회원가입
              </div>
              <div className="h-[14px] border border-customGray opacity-30"></div>
              <div
                onClick={handleFindPasswordPage}
                className="font-medium text-[14px] leading-[24px] text-customGray cursor-pointer"
              >
                비밀번호 찾기
              </div>
            </div>
            <div className="text-[10px] font-medium leading-[11.93px] text-[#888888] mt-20">
              Copyright 2024 Sing4U All rights reserved.
            </div>
          </div>
        </div>
      </form>
    </GoogleOAuthProvider>
  );
};

export default Login;
