import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ role, requiredRole, children }) => {
  if (!role) {
    // Redirect unauthenticated users to home instead of login
    return <Navigate to="/" replace />;
  }
  if (role !== requiredRole) {
    // Redirect if the user doesn't have the required role
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
