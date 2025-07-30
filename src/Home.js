import './css/Home.css';
import { useContext, useEffect, useState } from 'react';
import DashboardPage from './pages/DashboardPage';
import { useCookie } from './useCookie';
import LoginPage from './pages/LoginPage';
import { useGlobalStateValue } from './context/GlobalStateProvider';
import { actionTypes } from './context/globalReducer';
import { useLocalStorage } from './useLocalStorage';

/*
 * Home will be the page that holds the logic to decide if it renders "LoginPage", which is the frontpage
 * or "Dashboard", which is the page that displays the graphs for users that are logged in.
*/
function Home() {

  const [userJWTCookieValue, setUserJWTCookieValue, deleteUserJWTCookieValue] = useCookie("userJWT");
  const [userSessionDetailsValue, setUserSessionDetailsValue, deleteUserSessionDetailsValue] = useLocalStorage("userSessionDetails");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Context
  const [{ userJWTCookie }, dispatch] = useGlobalStateValue();

  useEffect(() => {
    dispatch({
      type: actionTypes.SET_USER_JWT_COOKIE,
      value: userJWTCookieValue
    })
  }, [userJWTCookieValue]);

  useEffect(() => {
    dispatch({
      type: actionTypes.SET_USER_SESSION_DETAILS,
      value: userSessionDetailsValue
    })
  }, [userSessionDetailsValue]);

  useEffect(() => {
    if (userJWTCookie !== "") {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [userJWTCookie]);

  const renderLoginPageOrDashboardPage = () => {
    if (isLoggedIn) {
      return (
        <DashboardPage />
      )
    } else {
      return (
        <LoginPage />
      )
    }
  }

  return (
    <div className="Home">
      {renderLoginPageOrDashboardPage()}
    </div>
  );
}

export default Home;
