// src/RegisterPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from './RegisterForm'; // Import component form đăng ký
import styles from './AuthPageLayout.module.css'; // Sử dụng chung một layout CSS nếu có thể, hoặc tạo riêng

// Giả sử bạn muốn RegisterPage có bố cục tương tự ForgotPasswordPage (một card ở giữa)
// Hoặc nếu bạn muốn bố cục 2 panel như LoginPage, bạn cần điều chỉnh CSS và JSX ở đây cho phù hợp.
// Ví dụ này sẽ làm theo kiểu một card ở giữa giống ForgotPasswordPage.

function RegisterPage() {
  const navigate = useNavigate();

  const handleSwitchToLogin = () => {
    navigate('/login');
  };

  return (
    <div className={styles.pageWrapper}> {/* Sử dụng class từ AuthPageLayout.module.css hoặc RegisterPage.module.css */}
      <div className={styles.formCard}>   {/* Sử dụng class từ AuthPageLayout.module.css hoặc RegisterPage.module.css */}
        {/* Bạn có thể thêm panel trái ở đây nếu muốn thiết kế 2 cột giống LoginPage */}
        {/* Ví dụ:
        <div className={styles.leftPanel}>
          <h1 className={styles.welcomeTitle}>Welcome!</h1>
          <p className={styles.welcomeText}>
            Join us and start your journey.
          </p>
        </div>
        */}
        {/* Panel phải chứa form, hoặc form là nội dung chính của card */}
        <RegisterForm onSwitchToLogin={handleSwitchToLogin} />
      </div>
    </div>
  );
}

export default RegisterPage;
