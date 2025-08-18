import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute Debug:', {
    isAuthenticated,
    loading,
    userRole: user?.role,
    allowedRoles,
    currentPath: location.pathname
  });

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user role
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'operator':
      case 'operation':
        return <Navigate to="/operator" replace />;
      case 'sales':
        return <Navigate to="/sales" replace />;
      case 'fleet':
        return <Navigate to="/fleet" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  // User is authenticated and has required role
  return children;
};

export default ProtectedRoute; 