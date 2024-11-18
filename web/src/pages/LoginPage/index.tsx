import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import logo from "@/assets/image.png";
import { useLoginPage } from "@/pages/LoginPage/module";

function LoginPage() {
  const { errorMessage, handleLoginSuccess } = useLoginPage();

  return (
    <GoogleOAuthProvider clientId="3330913078-gnja0ha00r03ep3l3k7kf92q2c2428o1.apps.googleusercontent.com">
      <div className="flex items-center justify-center min-h-screen bg-background transition-colors duration-300">
        <main className="bg-white dark:bg-gray-800 dark:border-gray-700 border-2 rounded-2xl shadow-lg p-10 w-full max-w-md transition-all duration-300">
          <img src={logo} alt="CliniTech Logo" className="w-32 h-auto mb-6 mx-auto" />
          <h1 className="text-3xl font-bold mb-8 text-primary dark:text-white text-center">
            Welcome to CliniTech
          </h1>
          {errorMessage && (
            <div className="text-red-600 mb-4 text-center font-semibold">
              {errorMessage}
            </div>
          )}
          <p className="text-gray-600 dark:text-gray-200 mb-6 text-center">
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
