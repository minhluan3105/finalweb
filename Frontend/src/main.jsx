// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';

// Import Context Provider
import { AuthProvider, useAuth } from './AuthContext.jsx';

// Import Page Components
import LoginPage from './LoginPage.jsx';
import ForgotPasswordPage from './ForgotPasswordPage.jsx';
import RegisterPage from './RegisterPage.jsx'; // <<<< ĐẢM BẢO DÒNG NÀY ĐÚNG
import Homepage from './Homepage.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';

// Import global styles
import './index.css';

// Helper component to handle root redirection based on auth state
function RootRedirect() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Hoặc một spinner/loading component đẹp hơn
  }

  return isAuthenticated ? <Navigate to="/homepage" replace /> : <Navigate to="/login" replace />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} /> {/* <<<< ĐẢM BẢO ROUTE NÀY ĐƯỢC ĐỊNH NGHĨA ĐÚNG */}
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          {/* Thêm các route public khác ở đây nếu có */}


          {/* Protected Routes: Wrap them with ProtectedRoute element */}
          <Route element={<ProtectedRoute />}>
            <Route path="/homepage" element={<Homepage />} />
            {/* Thêm các route được bảo vệ khác ở đây, ví dụ: /notes, /settings */}
            {/* Ví dụ: <Route path="/notes" element={<NotesPage />} /> */}
          </Route>

          {/* Root path handler */}
          <Route path="/" element={<RootRedirect />} />

          {/* Fallback cho các route không khớp (trang 404 tùy chỉnh) */}
          <Route 
            path="*" 
            element={
              <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h2>404 Not Found</h2>
                <p>The page you are looking for does not exist.</p>
                <Link to="/">Go Home</Link> {/* Sử dụng Link từ react-router-dom nếu bạn muốn */}
              </div>
            } 
          />
        </Routes>
      </AuthProvider>
    </Router>
  </React.StrictMode>,
);
