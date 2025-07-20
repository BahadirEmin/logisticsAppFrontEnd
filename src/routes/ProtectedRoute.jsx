import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  // Check if user is authenticated
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = userData.role;

  // Check if user has required role
  if (!allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard based on user role
    switch (userRole) {
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'operator':
        return <Navigate to="/operator" replace />;
      case 'sales':
        return <Navigate to="/sales" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  // User is authenticated and has required role
  return children;
};

export default ProtectedRoute; 