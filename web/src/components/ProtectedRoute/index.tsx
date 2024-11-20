import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useInjection } from "inversify-react";
import { ILoginService } from "@/service/IService/ILoginService";
import { TYPES } from "@/inversify/types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRoles = [] }) => {
  const loginService = useInjection<ILoginService>(TYPES.LoginService); // Injeta o serviço de login
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserClaims = async () => {
      try {
        const claims = await loginService.fetchClaims();
        const role = claims.find(
          (claim: { type: string; value: string }) =>
            claim.type === "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        )?.value;

        setIsAuthenticated(true);
        setUserRole(role ?? "Guest");
      } catch (error) {
        console.error("Failed to fetch claims:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUserClaims();
  }, [loginService]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated === false) {
    return <Navigate to="/" />;
  }

  if (requiredRoles.length > 0 && userRole && !requiredRoles.includes(userRole)) {
    return <Navigate to="/not-authorized" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
