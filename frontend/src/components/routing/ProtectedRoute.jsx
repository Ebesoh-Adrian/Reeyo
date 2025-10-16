// src/components/routing/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Import the mock context

// This wrapper component is crucial for applying the DashboardLayout 
// only to protected content, after the user is logged in.
import DashboardLayout from '../layout/DashboardLayout'; 

function ProtectedRoute({ element: Element }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Render the DashboardLayout wrapping the protected element if authenticated
  return <DashboardLayout><Element /></DashboardLayout>;
}

export default ProtectedRoute;