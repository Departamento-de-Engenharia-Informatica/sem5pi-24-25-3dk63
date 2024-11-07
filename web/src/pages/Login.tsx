import { GoogleLogin, GoogleOAuthProvider, CredentialResponse } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from '@/assets/image.png';

function LoginPage() {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleLoginSuccess = async (credentialResponse: CredentialResponse) => {
        const token = credentialResponse.credential;

        if (!token) {
            console.error("No credential token received");
            return;
        }

        try {
            const response = await fetch("https://localhost:5001/api/weblogin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ token }),
            });

            const result = await response.json();
            console.log(result);

            if (response.ok) {
                fetchClaims();
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
            const response = await fetch("https://localhost:5001/api/claims", {
                method: "GET",
                credentials: "include",
            });

            if (response.ok) {
                const claims = await response.json();
                const userRole = claims.find((claim: { type: string; value: string }) => claim.type === "http://schemas.microsoft.com/ws/2008/06/identity/claims/role")?.value;
                const status = claims.find((claim: { type: string; value: boolean }) => claim.type === "http://schemas.microsoft.com/ws/2008/06/identity/claims/status")?.value;

                if (userRole === "Admin") {
                    navigate("/admin");
                } else if (userRole === "Patient") {
                    navigate("/patient");
                } else {
                    navigate("/");
                }
            } else {
                setErrorMessage("Error obtaining user claims.");
                console.error("Error obtaining claims:", response.status);
            }
        } catch (error) {
            setErrorMessage("Error making request to obtain claims.");
            console.error("Error in request to obtain claims:", error);
        }
    };

    return (
        <GoogleOAuthProvider clientId="3330913078-gnja0ha00r03ep3l3k7kf92q2c2428o1.apps.googleusercontent.com">
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <main className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md">
                    <img src={logo} alt="CliniTech Logo" className="w-32 h-auto mb-6 mx-auto" />
                    <h1 className="text-3xl font-bold mb-8 text-[#284b62] text-center">
                        Welcome to CliniTech
                    </h1>
                    {errorMessage && (
                        <div className="text-red-600 mb-4 text-center font-semibold">
                            {errorMessage}
                        </div>
                    )}
                    <p className="text-gray-600 mb-6 text-center">
                        Please log in with your Google account to continue
                    </p>
                    <div className="flex justify-center">
                        <div className="w-full">
                            <GoogleLogin
                                type="standard"
                                shape="pill"
                                theme="outline"
                                text="signin_with"
                                size="large"
                                locale="en-GB"
                                logo_alignment="center"
                                onSuccess={handleLoginSuccess}
                            />
                        </div>
                    </div>
                </main>
            </div>
        </GoogleOAuthProvider>
    );
}

export default LoginPage;
