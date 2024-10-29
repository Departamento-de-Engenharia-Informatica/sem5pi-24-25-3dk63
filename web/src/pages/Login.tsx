import { GoogleLogin, GoogleOAuthProvider, CredentialResponse } from "@react-oauth/google";

function LoginPage() {
    const handleLoginSuccess = async (credentialResponse: CredentialResponse) => {
        const token = credentialResponse.credential;

        if (!token) {
            console.error("Nenhum token de credencial recebido");
            return;
        }

        try {
            const response = await fetch("https://localhost:5001/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // Inclui cookies
                body: JSON.stringify({ token }),
            });

            console.log(await response.json());
        } catch (error) {
            console.error("Erro na requisição ao backend:", error);
        }
    };

    return (
        <GoogleOAuthProvider clientId="3330913078-gnja0ha00r03ep3l3k7kf92q2c2428o1.apps.googleusercontent.com">
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <main className="bg-white rounded-lg shadow-lg p-8 w-80">
                    <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
                        Faça Login
                    </h1>
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
