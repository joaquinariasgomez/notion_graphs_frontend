import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalStateValue } from '../context/GlobalStateProvider';

function ProtectedRoute({ children }) {
  const [{ userJWTCookie }] = useGlobalStateValue();
  const navigate = useNavigate();

  // Check authentication synchronously during render
  const isAuthenticated = userJWTCookie && userJWTCookie !== "";

  useEffect(() => {
    // Redirect to login page if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Don't render children if not authenticated
  // This prevents child components from mounting and executing their effects
  if (!isAuthenticated) {
    return null;
  }

  // User is authenticated, render the protected content
  return children;
}

export default ProtectedRoute;

