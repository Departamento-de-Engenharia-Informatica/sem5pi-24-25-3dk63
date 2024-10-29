import { createContext } from "react";

import { useAuth } from "../hooks/useAuth";

const AuthContext = createContext<{
  isAuthenticated: boolean;
  role: string | null;
  username: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  logout: () => Promise<void>;
}>({
  isAuthenticated: false,
  role: null,
  username: null,
  login: () => Promise.resolve(),
  loginWithGoogle: () => Promise.resolve(),
  logout: () => Promise.resolve(),
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export default AuthContext;
