// src/RegisterForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RegisterForm.module.css';
import { useAuth } from './AuthContext';
import ReCAPTCHA from "react-google-recaptcha";

function RegisterForm({ onSwitchToLogin }) {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [captchaValue, setCaptchaValue] = useState('disabled_for_testing'); // Temporarily disable captcha by providing a dummy value

  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showActivationNotice, setShowActivationNotice] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!email) {
      newErrors.email = 'Please enter your email.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format.';
      isValid = false;
    }

    if (!displayName) {
      newErrors.displayName = 'Please enter display name.';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Please enter password.';
      isValid = false;
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
      isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number.';
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match!';
      isValid = false;
    }

    // if (!captchaValue) { // Temporarily disable captcha validation
    //   newErrors.captcha = 'Please complete the CAPTCHA.';
    //   isValid = false;
    // }

    setFieldErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    setSuccessMessage('');
    setFieldErrors({});

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    const registrationData = {
      email,
      name: displayName,
      password,
      password_confirmation: confirmPassword,
      // captcha: captchaValue // Temporarily disable captcha
    };

    try {
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (responseData.errors && typeof responseData.errors === 'object') {
          setFieldErrors(prevErrors => ({ ...prevErrors, ...responseData.errors }));
        }
        setGeneralError(responseData.message || `Registration failed. Status: ${response.status}`);
      } else {
        setSuccessMessage('Account registered successfully!');
        console.log('Registration successful:', responseData);

        const { user, access_token } = responseData;

        if (user && access_token) {
          login(user, access_token);
          setShowActivationNotice(true);
          navigate('/homepage', { replace: true });
        } else {
          setGeneralError('Registration successful, but auto-login failed. Please log in manually.');
        }
      }
    } catch (networkError) {
      setGeneralError('Could not connect to the server or an error occurred. Please try again.');
      console.error('Network error during registration:', networkError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>Create Account</h2>

      {showActivationNotice && (
        <div className={styles.activationNotice}>
          <h3>Account Created Successfully!</h3>
          <p>Please check your email to activate your account. You can still use the application, but some features may be limited until you activate your account.</p>
        </div>
      )}

      {generalError && <p className={styles.errorMessageGlobal}>{generalError}</p>}
      {successMessage && !login && <p className={styles.successMessage}>{successMessage}</p>}

      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <div className={styles.inputGroup}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`${styles.input} ${fieldErrors.email ? styles.inputError : ''}`}
            aria-invalid={fieldErrors.email ? "true" : "false"}
            aria-describedby={fieldErrors.email ? "email-error" : undefined}
            disabled={isLoading}
          />
          {fieldErrors.email && <p id="email-error" className={styles.errorMessageField}>{fieldErrors.email}</p>}
        </div>

        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className={`${styles.input} ${fieldErrors.displayName ? styles.inputError : ''}`}
            aria-invalid={fieldErrors.displayName ? "true" : "false"}
            aria-describedby={fieldErrors.displayName ? "displayName-error" : undefined}
            disabled={isLoading}
          />
          {fieldErrors.displayName && <p id="displayName-error" className={styles.errorMessageField}>{fieldErrors.displayName}</p>}
        </div>

        <div className={styles.inputGroup}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`${styles.input} ${fieldErrors.password ? styles.inputError : ''}`}
            aria-invalid={fieldErrors.password ? "true" : "false"}
            aria-describedby={fieldErrors.password ? "password-error" : undefined}
            disabled={isLoading}
          />
          {fieldErrors.password && <p id="password-error" className={styles.errorMessageField}>{fieldErrors.password}</p>}
          <div className={styles.passwordRequirements}>
            Password must be at least 8 characters long and contain:
            <ul>
              <li>At least one uppercase letter</li>
              <li>At least one lowercase letter</li>
              <li>At least one number</li>
            </ul>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`${styles.input} ${fieldErrors.confirmPassword ? styles.inputError : ''}`}
            aria-invalid={fieldErrors.confirmPassword ? "true" : "false"}
            aria-describedby={fieldErrors.confirmPassword ? "confirmPassword-error" : undefined}
            disabled={isLoading}
          />
          {fieldErrors.confirmPassword && <p id="confirmPassword-error" className={styles.errorMessageField}>{fieldErrors.confirmPassword}</p>}
        </div>

        <div className={styles.inputGroup}>
          {/* <ReCAPTCHA // Temporarily disable captcha
            sitekey="YOUR_SITE_KEY_HERE"
            onChange={(value) => setCaptchaValue(value)}
            className={styles.recaptcha}
          /> */}
          {/* {fieldErrors.captcha && <p className={styles.errorMessageField}>{fieldErrors.captcha}</p>} */}
        </div>

        <button type="submit" className={styles.submitButton} disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <p className={styles.switchToLogin}>
        Already have an account?{' '}
        <button onClick={onSwitchToLogin} className={styles.linkButton} disabled={isLoading}>
          Sign In
        </button>
      </p>
    </div>
  );
}

export default RegisterForm;
