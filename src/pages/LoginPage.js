import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import '../css/LoginPage.css';
import { loginWithGoogle } from '../api/RequestUtils';
import { useState } from 'react';

function LoginPage() {
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    console.log('Google Login Success:', credentialResponse);
    try {
      setIsLoggingIn(true);
      const googleTokenBody = JSON.stringify(
        {
          "token": credentialResponse.credential
        }
      );
      const apiResponse = await loginWithGoogle(googleTokenBody);
      if (apiResponse) {
        console.log('API Response:', apiResponse);
        // setUserJWTCookie(apiResponse.session_jwt, 7);
        // setUserSessionDetailsValue(apiResponse.owner.user);
      }
    } catch (error) {
      // TODO JAQUIN: do something
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLoginError = () => {
    console.error('Google Login Failed');
    // TODO: Handle login error (show error message to user)
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID}>
      <div className="login-page">
        <div className="login-container">
          <button className="back-button" onClick={handleBackToHome}>
            ← Back to Home
          </button>

          <div className="login-content">
            <div className="login-header">
              <img
                src={process.env.PUBLIC_URL + '/NotionWallet_icon.png'}
                alt="NotionWallet Icon"
                className="login-logo"
              />
              <h1 className="login-title">
                <span>Notion</span>
                <span className="wallet-part">Wallet</span>
              </h1>
              <p className="login-subtitle">Sign in to access your dashboard</p>
            </div>

            <div className="login-buttons">
              <div className="google-login-wrapper">
                <GoogleLogin
                  onSuccess={handleGoogleLoginSuccess}
                  onError={handleGoogleLoginError}
                  theme="filled_blue"
                  size="large"
                  text="signin_with"
                  shape="rectangular"
                />
              </div>
            </div>

            <div className="login-footer">
              <p className="login-footer-text">
                By signing in, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default LoginPage;

