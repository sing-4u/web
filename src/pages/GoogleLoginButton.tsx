import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface GoogleLoginButtonProps {
  onSuccess: (accessToken: string, refreshToken: string) => void;
  onError: (error: string) => void;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  onSuccess,
  onError,
}) => {
  const navigate = useNavigate();

  const initiateGoogleLogin = () => {
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

        onSuccess(accessToken, refreshToken);
      } catch (error) {
        onError("Google 로그인에 실패했습니다.");
      }
    };

    if (authCode) {
      processGoogleLogin(authCode);
    } else {
      console.log("NO AUTH CODE");
    }
  }, [navigate]);

  return (
    <div className="absolute w-[327px] h-[52px] top-[293px] left-[24px] rounded-[10px] border border-black flex items-center justify-center">
      <button
        type="button"
        onClick={initiateGoogleLogin}
        className="w-full h-full flex items-center justify-center font-bold text-[14px] leading-[16.71px] cursor-pointer"
      >
        Google로 계속하기
      </button>
    </div>
  );
};

export default GoogleLoginButton;
