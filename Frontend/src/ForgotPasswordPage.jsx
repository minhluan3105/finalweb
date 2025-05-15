import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Để có link quay lại trang đăng nhập
import styles from './ForgotPasswordPage.module.css'; // Tạo file CSS Module cho trang này

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(''); // Để hiển thị thông báo thành công/lỗi
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    // TODO: Gọi API Backend ở đây để gửi yêu cầu đặt lại mật khẩu
    // Ví dụ:
    // try {
    //   const response = await fetch('/api/auth/forgot-password', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email }),
    //   });
    //   const data = await response.json();
    //   if (response.ok) {
    //     setMessage('Nếu email của bạn tồn tại trong hệ thống, một liên kết đặt lại mật khẩu đã được gửi.');
    //   } else {
    //     setMessage(data.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
    //   }
    // } catch (error) {
    //   setMessage('Lỗi kết nối. Vui lòng thử lại.');
    // }

    // Giả lập gọi API thành công để test giao diện
    setTimeout(() => {
      console.log('Requesting password reset for:', email);
      setMessage(`Nếu email "${email}" tồn tại trong hệ thống, một hướng dẫn đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn.`);
      setIsLoading(false);
      // setEmail(''); // Xóa email sau khi gửi (tùy chọn)
    }, 2000);
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.formCard}>
        <h1 className={styles.title}>Quên Mật Khẩu?</h1>
        <p className={styles.instructions}>
          Đừng lo lắng! Hãy nhập địa chỉ email bạn đã sử dụng để đăng ký và chúng tôi sẽ gửi cho bạn một hướng dẫn để đặt lại mật khẩu.
        </p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Địa chỉ Email</label>
            <input
              type="email"
              id="email"
              className={styles.input}
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {message && <p className={styles.message}>{message}</p>}
          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? 'Đang xử lý...' : 'Gửi Hướng Dẫn'}
          </button>
        </form>
        <div className={styles.backToLogin}>
          <Link to="/login" className={styles.backLink}>Quay lại Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;