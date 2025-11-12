import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import eventBus from '../utils/eventBus';
import { useCookie } from '../useCookie';
import { useLocalStorage } from '../useLocalStorage';

/**
 * SessionManager component handles session expiration globally
 * Listens for sessionExpired events and redirects to login
 */
function SessionManager({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [, , deleteUserJWTCookie] = useCookie("userJWT");
  const [, , deleteUserSessionDetails] = useLocalStorage("userSessionDetails");

  useEffect(() => {
    const handleSessionExpired = () => {
      // Clear all user authentication data
      deleteUserJWTCookie();
      deleteUserSessionDetails();

      // Only redirect if not already on login or landing page
      if (location.pathname !== '/login' && location.pathname !== '/') {
        navigate('/login', { replace: true });
      }
    };

    // Subscribe to sessionExpired event
    eventBus.on('sessionExpired', handleSessionExpired);

    // Cleanup on unmount
    return () => {
      eventBus.off('sessionExpired', handleSessionExpired);
    };
  }, [deleteUserJWTCookie, deleteUserSessionDetails, navigate, location.pathname]);

  return children;
}

export default SessionManager;

