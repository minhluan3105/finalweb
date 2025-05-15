// src/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // To check initial auth status

  // Effect to check for existing token on initial load (optional but good practice)
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData'); // You might store basic user data too

    if (token) {
      // Here, you might want to verify the token with your backend
      // For simplicity, we'll assume if a token exists, the user is "logged in"
      // In a real app, decode the token to get user info or fetch user profile
      try {
        if (userData) {
          setCurrentUser(JSON.parse(userData));
        } else {
          // If only token, set a placeholder or fetch user data
          // For this example, let's assume token means a generic logged-in state
          // You'd normally fetch user details from backend using the token
          setCurrentUser({ token }); // Or a more complete user object
        }
      } catch (error) {
        console.error("Failed to parse user data from localStorage", error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userData)); // Store user data
    setCurrentUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setCurrentUser(null);
    // Optionally, call a backend logout endpoint here
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser, // True if currentUser is not null
    isLoading,
    login,
    logout,
    // You can add more specific user data or functions here
    // e.g., isVerified: currentUser?.isVerified
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
