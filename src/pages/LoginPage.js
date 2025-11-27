import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import '../css/LoginPage.css';
import { loginWithGoogle } from '../api/RequestUtils';
import { useState } from 'react';
import { useCookie } from '../useCookie';
import { useLocalStorage } from '../useLocalStorage';
import FirstTimeLoginModal from '../components/FirstTimeLoginModal';

function LoginPage() {

  const [userJWTCookie, setUserJWTCookie, deleteUserJWTCookie] = useCookie("userJWT");
  const [userSessionDetailsValue, setUserSessionDetailsValue, deleteUserSessionDetailsValue] = useLocalStorage("userSessionDetails");
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showFirstTimeModal, setShowFirstTimeModal] = useState(false);

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      setIsLoggingIn(true);
      const googleTokenBody = JSON.stringify(
        {
          "token": credentialResponse.credential
        }
      );
      const apiResponse = await loginWithGoogle(googleTokenBody);
      if (apiResponse) {
        setUserJWTCookie(apiResponse.session_jwt, 7);
        const userSessionDetails = {
          email: apiResponse.email,
          name: apiResponse.name,
          pictureUrl: apiResponse.pictureUrl
        };
        setUserSessionDetailsValue(userSessionDetails);

        // Check if this is the user's first time logging in
        if (apiResponse.firstTimeLogin) {
          setShowFirstTimeModal(true);
        } else {
          handleGoToDashboard();
        }
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

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  }

  const handleCloseFirstTimeModal = () => {
    setShowFirstTimeModal(false);
    handleGoToDashboard();
  }

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID}>
      {showFirstTimeModal && (
        <FirstTimeLoginModal
          onClose={handleCloseFirstTimeModal}
        />
      )}
      <div className="login-page">
        <div className="login-container">
          {/* <button className="back-button" onClick={handleBackToHome}>
            ← Back to Home
          </button> */}
          {isLoggingIn && (
            <div className="login-loading-overlay">
              <div className="login-spinner"></div>
              <p className="login-loading-text">Logging in...</p>
            </div>
          )}

          <div className='login-content'>
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
                  disabled={isLoggingIn}
                />

              </div>
              <p className="login-footer-text">
                By signing in, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
            <div className="login-footer">
              <button
                className="login-footer-back-button"
                onClick={handleBackToHome}
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default LoginPage;

