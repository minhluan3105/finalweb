// src/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Import the useAuth hook

function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth(); // Get auth status and loading state
  const location = useLocation(); // Get the current location

  if (isLoading) {
    // Show a loading indicator while checking auth status
    // This prevents a flash of the login page if the user is actually logged in
    // but the auth check is still in progress on initial load.
    return <div>Loading authentication status...</div>; // Replace with a proper spinner or loading component
  }

  if (!isAuthenticated) {
    // If the user is not authenticated, redirect them to the /login page.
    // We also pass the current location in the state. This allows us to redirect
    // the user back to the page they were trying to access after they log in.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If the user is authenticated, render the child route elements.
  // <Outlet /> is a placeholder for the actual route component being protected.
  return <Outlet />;
}

export default ProtectedRoute;
