import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Check if user is authenticated
  const isAuthenticated = sessionStorage.getItem('adminAuthenticated') === 'true';

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/admin-login" />;
  }

  // If authenticated, render the protected component
  return <>{children}</>;
}