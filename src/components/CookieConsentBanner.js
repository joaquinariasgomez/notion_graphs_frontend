import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/CookieConsentBanner.css';

const CONSENT_KEY = 'cookieConsent';

function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      // Small delay before showing banner for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setIsVisible(false);
    
    // Initialize Google Analytics
    if (window.initializeGoogleAnalytics) {
      window.initializeGoogleAnalytics();
    }
  };

  const handleDecline = () => {
    localStorage.setItem(CONSENT_KEY, 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-banner">
      <div className="cookie-banner__content">
        <div className="cookie-banner__icon">🍪</div>
        <div className="cookie-banner__text">
          <p className="cookie-banner__title">We use cookies</p>
          <p className="cookie-banner__description">
            We use analytics cookies to understand how you use our website and improve your experience.
            Read our <Link to="/privacy-policy" className="cookie-banner__link">Privacy Policy</Link> for more information.
          </p>
        </div>
        <div className="cookie-banner__actions">
          <button 
            className="cookie-banner__button cookie-banner__button--decline"
            onClick={handleDecline}
          >
            Decline
          </button>
          <button 
            className="cookie-banner__button cookie-banner__button--accept"
            onClick={handleAccept}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

export default CookieConsentBanner;

