import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ILoginService } from "@/service/IService/ILoginService";
import { TYPES } from "@/inversify/types";
import { useInjection } from "inversify-react";

export const useLoginPage = () => {
  const loginService = useInjection<ILoginService>(TYPES.LoginService);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLoginSuccess = async (credentialResponse: any) => {
    const token = credentialResponse.credential;

    if (!token) {
      console.error("No credential token received");
      return;
    }

    try {
      await loginService.loginWithToken(token);

      const { redirectTo } = await loginService.getLoginClaims();
      navigate(redirectTo);
    } catch (error) {
      setErrorMessage((error as Error).message || "Error in login process.");
      console.error("Login error:", error);
      navigate("/self-register");
    }
  };

  return { errorMessage, handleLoginSuccess };
};
