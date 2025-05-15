// src/LoginPage.jsx
import { useState } from 'react';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Thêm useNavigate và useLocation
import styles from './LoginPage.module.css'; // Đảm bảo bạn đã có file CSS này
import { useAuth } from './AuthContext'; // <<<< THÊM IMPORT useAuth

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Để hiển thị lỗi đăng nhập
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth(); // <<<< LẤY HÀM LOGIN TỪ AUTHCONTEXT

  // Xác định trang sẽ điều hướng đến sau khi đăng nhập thành công
  // Nếu người dùng bị redirect từ một trang khác, state 'from' sẽ chứa thông tin đó
  const from = location.state?.from?.pathname || "/homepage"; // Mặc định là /homepage

  const handleSubmitSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // ---- BẮT ĐẦU PHẦN GỌI API BACKEND ĐỂ ĐĂNG NHẬP ----
    // Đây là ví dụ, bạn cần thay thế bằng logic gọi API thực tế
    try {
      // Giả sử API của bạn là '/api/auth/login'
      const response = await fetch('http://localhost:8000/api/auth/login', { // URL API Đăng nhập của bạn
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        setError(responseData.message || `Đăng nhập thất bại. Mã lỗi: ${response.status}`);
      } else {
        // Đăng nhập thành công
        console.log('Đăng nhập thành công:', responseData);

        // Giả sử backend trả về đối tượng user và token
        // Ví dụ: responseData = { user: { id: 1, email: '...', displayName: '...' }, token: 'yourAuthToken' }
        const userData = responseData.user || { email, displayName: 'User' }; // Lấy thông tin user từ response hoặc tạo placeholder
        const token = responseData.access_token;

        if (token) {
          login(userData, token); // <<<< GỌI HÀM LOGIN TỪ AUTHCONTEXT
          navigate(from, { replace: true }); // <<<< ĐIỀU HƯỚNG ĐẾN TRANG 'from' HOẶC /homepage
        } else {
          setError('Không nhận được token xác thực từ máy chủ.');
        }
      }
    } catch (networkError) {
      setError('Không thể kết nối đến máy chủ hoặc có lỗi xảy ra. Vui lòng thử lại.');
      console.error('Lỗi mạng khi đăng nhập:', networkError);
    } finally {
      setIsLoading(false);
    }
    // ---- KẾT THÚC PHẦN GỌI API BACKEND ----

    // // ---- PHẦN GIẢ LẬP ĐĂNG NHẬP (XÓA KHI CÓ BACKEND) ----
    // console.log('Attempting login with:', email, password);
    // setTimeout(() => {
    //   if (email === "test@example.com" && password === "password") {
    //     const mockUserData = {
    //       id: 1,
    //       email: email,
    //       displayName: "Test User",
    //       // isVerified: false // Thêm trạng thái này nếu backend trả về
    //     };
    //     const mockToken = "fake-auth-token-12345";
    //     login(mockUserData, mockToken); // Gọi hàm login từ context
    //     navigate(from, { replace: true }); // Điều hướng
    //   } else {
    //     setError("Email hoặc mật khẩu không đúng.");
    //   }
    //   setIsLoading(false);
    // }, 1000);
    // // ---- KẾT THÚC PHẦN GIẢ LẬP ----
  };

  // Phần JSX của bạn giữ nguyên cấu trúc 2 panel
  // Chỉ cần đảm bảo các input và button hoạt động với state và hàm handleSubmit ở trên.
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        {/* Left Panel */}
        <div className={styles.leftPanel}>
          <div className={styles.leftPanelContent}>
            <h1 className={styles.leftTitle}>Hello, Friend!</h1>
            <p className={styles.leftText}>
              Enter your personal details and start your journey with us.
            </p>
            {/* Nút này có thể điều hướng đến trang đăng ký */}
            <button
              className={styles.panelButton} // Sử dụng một class khác nếu muốn style khác signUpButton
              onClick={() => navigate('/register')}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Right Panel (Sign In Form) */}
        <div className={styles.rightPanel}>
          <div className={styles.formContainer}>
            <h2 className={styles.rightTitle}>Sign In</h2>
            {error && <p className={styles.errorMessageGlobal}>{error}</p>} {/* Hiển thị lỗi chung */}
            <form onSubmit={handleSubmitSignIn} className={styles.form}>
              <div className={styles.inputGroup}>
                <FaEnvelope className={styles.inputIcon} />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input} // Thêm class lỗi nếu cần: `${styles.input} ${fieldError.email ? styles.inputError : ''}`
                  required
                />
                {/* Hiển thị lỗi trường email nếu có */}
              </div>
              <div className={styles.inputGroup}>
                <FaLock className={styles.inputIcon} />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input} // Thêm class lỗi nếu cần
                  required
                />
                {/* Hiển thị lỗi trường password nếu có */}
              </div>
              <div className={styles.formOptions}>
                <label className={styles.rememberMeLabel}>
                  <input type="checkbox" className={styles.checkbox} />
                  <span className={styles.rememberMeText}>Remember me</span>
                </label>
                <Link to="/forgot-password" className={styles.forgotPasswordLink}>
                  Forgot Password?
                </Link>
              </div>
              <button
                type="submit"
                className={styles.signInButton}
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
            <p className={styles.switchToRegister}>
              Don't have an account?{' '}
              <button onClick={() => navigate('/register')} className={styles.linkButton}>
                Create Account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
