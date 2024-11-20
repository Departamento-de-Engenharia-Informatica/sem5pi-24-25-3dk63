import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useLoginPage = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLoginSuccess = async (credentialResponse: any) => {
    const token = credentialResponse.credential;

    if (!token) {
      console.error("No credential token received");
      return;
    }

    try {
      const response = await fetch("https://lapr5.sytes.net:5001/api/weblogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ token }),
      });

      const result = await response.json();
      if (response.ok) {
        await fetchClaims();
      } else {
        setErrorMessage(result.Message);
        console.error("Login failed:", result.Message);
        navigate("/self-register");
      }
    } catch (error) {
      setErrorMessage("Error in request to backend.");
      console.error("Error in request to backend:", error);
    }
  };

  const fetchClaims = async () => {
    try {
      const response = await fetch("https://lapr5.sytes.net:5001/api/claims", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const claims = await response.json();
        const userRole = claims.find(
          (claim: { type: string; value: string }) =>
            claim.type ===
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        )?.value;

        if (userRole === "Admin") navigate("/admin");
        else if (userRole === "Patient") navigate("/patient");
        else if (
          userRole === "Doctor" ||
          userRole === "Nurse" ||
          userRole === "Technician"
        )
          navigate("/staff");
        else navigate("/");
      } else {
        setErrorMessage("Error obtaining user claims.");
        console.error("Error obtaining claims:", response.status);
      }
    } catch (error) {
      setErrorMessage("Error making request to obtain claims.");
      console.error("Error in request to obtain claims:", error);
    }
  };

  return { errorMessage, handleLoginSuccess };
};
