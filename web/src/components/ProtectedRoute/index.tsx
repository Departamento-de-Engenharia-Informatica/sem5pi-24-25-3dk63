import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRoles = [] }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await fetch('https://localhost:5001/api/claims', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const claims = await response.json();
          const role = claims.find(
            (claim: { type: string; value: string }) =>
              claim.type === 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
          )?.value;

          setIsAuthenticated(true);
          setUserRole(role);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Failed to fetch claims:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

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
