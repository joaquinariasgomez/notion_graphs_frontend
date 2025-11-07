import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalStateValue } from '../context/GlobalStateProvider';
import { connectToNotion } from '../api/RequestUtils';
import { actionTypes } from '../context/globalReducer';
import ClipLoader from "react-spinners/ClipLoader";
import '../css/NotionCallbackPage.css';

/**
 * NotionCallbackPage
 * Handles the OAuth callback from Notion API.
 * This page receives the authorization code and exchanges it with the backend.
 * User must be authenticated (have JWT token) to use this endpoint.
 */
function NotionCallbackPage() {
  const [{ userJWTCookie }, dispatch] = useGlobalStateValue();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    handleNotionCallback();
  }, []);

  const handleNotionCallback = async () => {
    try {
      // Extract the authorization code from URL
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const errorParam = params.get("error");

      // Check if user denied access
      if (errorParam === "access_denied") {
        setError("You denied access to Notion. Please try again if you'd like to connect.");
        setTimeout(() => navigate('/dashboard'), 3000);
        return;
      }

      // Check if code exists
      if (!code) {
        setError("No authorization code received from Notion.");
        setTimeout(() => navigate('/dashboard'), 3000);
        return;
      }

      // Check if user is authenticated
      if (!userJWTCookie || userJWTCookie === "") {
        setError("You must be logged in to connect Notion.");
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      // Exchange code with backend
      console.log('Processing Notion authorization code...');
      const apiResponse = await connectToNotion(userJWTCookie, code);
      if (apiResponse) {
        // TODO JOAQUIN: save some Notion user data maybe in the Session
        // apiResponse.owner
        navigate('/dashboard');
      } else {
        setError("Failed to connect to Notion. Please try again.");
        setTimeout(() => navigate('/dashboard'), 1500);
      }
    } catch (error) {
      console.error('Error processing Notion callback:', error);
      setError(error?.response?.data?.message || "An error occurred while connecting to Notion.");
      setTimeout(() => navigate('/dashboard'), 3000);
    } finally {
      setIsProcessing(false);
    }
  };

  if (error) {
    return (
      <div className="notion-callback-page">
        <div className="notion-callback-container">
          <div className="notion-callback-icon error">❌</div>
          <h1>Connection Failed</h1>
          <p className="notion-callback-message">{error}</p>
          <p className="notion-callback-redirect">Redirecting you back...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notion-callback-page">
      <div className="notion-callback-container">
        <div className="notion-callback-icon">
          <img
            src={process.env.PUBLIC_URL + '/notion_logo.png'}
            alt="Notion Logo"
            className="notion-logo-spinner"
          />
        </div>
        <h1>Connecting to Notion</h1>
        <p className="notion-callback-message">
          Please wait while we establish the connection to your Notion workspace...
        </p>
        <ClipLoader size={40} color="#4CAF50" />
      </div>
    </div>
  );
}

export default NotionCallbackPage;

