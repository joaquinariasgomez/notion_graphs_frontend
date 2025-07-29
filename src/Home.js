import './css/Home.css';
import { useEffect, useState } from 'react';
import DashboardPage from './pages/DashboardPage';
import { useCookie } from './useCookie';
import LoginPage from './pages/LoginPage';

/*
 * Home will be the page that holds the logic to decide if it renders "LoginPage", which is the frontpage
 * or "Dashboard", which is the page that displays the graphs for users that are logged in.
*/
function Home() {

  const [userJWTCookie, setUserJWTCookie, deleteUserJWTCookie] = useCookie("userJWT");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Context
  //const [{userJWTCookie}] maybe I dont need to store the cookie in the context

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
