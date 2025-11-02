import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import '../css/LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();

  const handleGoogleLoginSuccess = (credentialResponse) => {
    console.log('Google Login Success:', credentialResponse);
    // TODO: Send the credential to your backend for verification
    // Example: 
    // const { credential } = credentialResponse;
    // Send credential to backend API for verification and JWT token generation
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

