import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalStateValue } from '../context/GlobalStateProvider';
import ClipLoader from "react-spinners/ClipLoader";
import Confetti from 'react-confetti';
import '../css/NotionCallbackPage.css'; // Reuse similar styling

/**
 * StripeCheckoutPage
 * Handles the callback from Stripe Checkout.
 * This page receives the success/cancel status after payment flow.
 * User must be authenticated (have JWT token) to use this endpoint.
 */
function StripeCheckoutPage() {
  const [{ userJWTCookie }] = useGlobalStateValue();
  const [isProcessing, setIsProcessing] = useState(true);
  const [status, setStatus] = useState(null); // 'success', 'cancel', or 'error'
  const [message, setMessage] = useState('');
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const navigate = useNavigate();

  useEffect(() => {
    handleStripeCallback();

    // Update window dimensions for confetti
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleStripeCallback = async () => {
    try {
      // Extract the status from URL query parameters
      const params = new URLSearchParams(window.location.search);
      const success = params.get("success");
      const cancel = params.get("cancel");

      // Check if user is authenticated
      if (!userJWTCookie || userJWTCookie === "") {
        setStatus('error');
        setMessage("You must be logged in to complete this action.");
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      // Handle success scenario
      if (success === "true") {
        setStatus('success');
        setMessage("Your Notion Wallet plan has been upgraded.");
        setTimeout(() => navigate('/dashboard'), 15000);
        return;
      }

      // Handle cancel scenario
      if (cancel === "true") {
        // Redirect to billing plans page
        navigate('/billing-plans');
        return;
      }

      // If neither success nor cancel parameter is present
      setStatus('error');
      setMessage("Invalid checkout status.");
      setTimeout(() => navigate('/dashboard'), 4000);
    } catch (error) {
      setStatus('error');
      setMessage("An error occurred while processing your payment.");
      setTimeout(() => navigate('/dashboard'), 4000);
    } finally {
      setIsProcessing(false);
    }
  };

  // Render processing state
  if (isProcessing) {
    return (
      <div className="notion-callback-page">
        <div className="notion-callback-container">
          <div className="notion-callback-icon">
            <ClipLoader size={50} color="#635BFF" />
          </div>
          <h1>Processing Payment</h1>
          <p className="notion-callback-message">
            Please wait while we process your payment...
          </p>
        </div>
      </div>
    );
  }

  // Render success state
  if (status === 'success') {
    return (
      <div className="notion-callback-page">
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={800}
          gravity={0.25}
          initialVelocityY={20}
          initialVelocityX={5}
          colors={['#635BFF', '#0A2540', '#00D4FF', '#7A73FF', '#FFD700', '#FFA500']}
          tweenDuration={5000}
        />
        <div className="notion-callback-container">
          <h1>Payment Successful! ✅</h1>
          <p className="notion-callback-message">{message}</p>
          <button
            className="stripe-dashboard-button"
            onClick={() => navigate('/dashboard')}
          >
            Go to my dashboard
          </button>
        </div>
      </div>
    );
  }

  // Render error state
  return (
    <div className="notion-callback-page">
      <div className="notion-callback-container">
        <h1>Something Went Wrong ❌</h1>
        <p className="notion-callback-message">{message}</p>
        <p className="notion-callback-redirect">Redirecting you back...</p>
      </div>
    </div>
  );
}

export default StripeCheckoutPage;

