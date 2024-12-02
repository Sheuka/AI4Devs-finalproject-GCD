import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: JSX.Element;
  requiredRole: "CLIENT" | "PROFESSIONAL" | "ADMIN";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user } = useAuth();
  if (!user || user.role !== requiredRole) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
