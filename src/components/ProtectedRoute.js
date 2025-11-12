import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalStateValue } from '../context/GlobalStateProvider';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { loginWithGoogle } from '../api/RequestUtils';
import { useCookie } from '../useCookie';
import '../css/ProtectedRoute.css';
import { useLocalStorage } from '../useLocalStorage';

function ProtectedRoute({ children }) {
  const [{ userJWTCookie }] = useGlobalStateValue();
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [, setUserJWTCookie] = useCookie("userJWT");
  const [, setUserSessionDetailsValue] = useLocalStorage("userSessionDetails");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    if (!userJWTCookie || userJWTCookie === "") {
      setShowLoginPopup(true);
    } else {
      setShowLoginPopup(false);
    }
  }, [userJWTCookie]);

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      setIsLoggingIn(true);
      const googleTokenBody = JSON.stringify({
        "token": credentialResponse.credential
      });
      const apiResponse = await loginWithGoogle(googleTokenBody);
      if (apiResponse) {
        setUserJWTCookie(apiResponse.session_jwt, 7);
        const userSessionDetails = {
          email: apiResponse.email,
          name: apiResponse.name,
          pictureUrl: apiResponse.pictureUrl
        };
        setUserSessionDetailsValue(userSessionDetails);
        setShowLoginPopup(false);
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLoginError = () => {
    console.error('Google Login Failed');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  if (showLoginPopup) {
    return (
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID}>
        <div className="protected-route-overlay">
          <div className="protected-route-popup">
            {isLoggingIn && (
              <div className="protected-route-loading-overlay">
                <div className="protected-route-spinner"></div>
                <p className="protected-route-loading-text">Logging in...</p>
              </div>
            )}

            <button className="protected-route-close" onClick={handleBackToHome}>
              ✕
            </button>

            <div className="protected-route-content">
              <div className="protected-route-header">
                <img
                  src={process.env.PUBLIC_URL + '/NotionWallet_icon.png'}
                  alt="NotionWallet Icon"
                  className="protected-route-logo"
                />
                <h1 className="protected-route-title">
                  <span>Notion</span>
                  <span className="wallet-part">Wallet</span>
                </h1>
                <p className="protected-route-subtitle">
                  Please sign in to access the dashboard
                </p>
              </div>

              <div className="protected-route-buttons">
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
              </div>

              <div className="protected-route-footer">
                <button
                  className="protected-route-back-button"
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

  // User is authenticated, render the protected content
  return children;
}

export default ProtectedRoute;

