// src/Homepage.jsx
import React from 'react';
import { useAuth } from './AuthContext'; // To potentially display user info or logout
import { useNavigate } from 'react-router-dom';

function Homepage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Welcome to Your Personalized Homepage!</h1>
      {currentUser && (
        <div>
          <p>Hello, {currentUser.displayName || currentUser.email || 'User'}!</p>
          {/* You can display more user information here if available in currentUser */}
          {/* For example, if currentUser contains an email:
          <p>Email: {currentUser.email}</p>
          */}
          <p>This is your protected area where you can view your notes.</p>
        </div>
      )}
      <button
        onClick={handleLogout}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          color: 'white',
          backgroundColor: '#f44336', // A red color for logout
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '20px',
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default Homepage;
