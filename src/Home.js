import logo from './logo.svg';
import './css/Home.css';
import { useState } from 'react';
import DashboardPage from './pages/DashboardPage';

/*
 * Home will be the page that holds the logic to decide if it renders "LoginPage", which is the frontpage
 * or "Dashboard", which is the page that displays the graphs for users that are logged in.
*/
function Home() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const renderLoginPageOrDashboardPage = () => {
    if (isLoggedIn) {
      return (
        <DashboardPage />
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
