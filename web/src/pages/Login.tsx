import { GoogleLogin, GoogleOAuthProvider, CredentialResponse } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function LoginPage() {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleLoginSuccess = async (credentialResponse: CredentialResponse) => {
        const token = credentialResponse.credential;

        if (!token) {
            console.error("Nenhum token de credencial recebido");
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
                console.error("Login falhou:", result.Message);
            }
        } catch (error) {
            setErrorMessage("Erro na requisição ao backend.");
            console.error("Erro na requisição ao backend:", error);
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
                }else if(userRole === "Patient"){
                    if (!status)
                    {
                        // Dps mudar para navigate("/register-patient")
                        navigate("/patient");
                    } else {
                        //navigate("/patient");
                    }
                    
                } else {
                    navigate("/");
                }
            } else {
                setErrorMessage("Erro ao obter claims do usuário.");
                console.error("Erro ao obter claims:", response.status);
            }
        } catch (error) {
            setErrorMessage("Erro ao fazer requisição para obter claims.");
            console.error("Erro na requisição ao obter claims:", error);
        }
    };

    return (
        <GoogleOAuthProvider clientId="3330913078-gnja0ha00r03ep3l3k7kf92q2c2428o1.apps.googleusercontent.com">
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <main className="bg-white rounded-lg shadow-lg p-8 w-80">
                    <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
                        Faça Login
                    </h1>
                    {errorMessage && (
                        <div className="text-red-500 mb-4 text-center">{errorMessage}</div>
                    )}
                    <div className="flex justify-center">
                        <div className="w-full">
                            <GoogleLogin
                                type="standard"
                                shape="pill"
                                theme="outline"
                                text="continue_with"
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
