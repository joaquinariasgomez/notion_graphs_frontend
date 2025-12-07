import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/LandingPage.css';
import { useGlobalStateValue } from '../context/GlobalStateProvider';

function LandingPageHeader() {

  // Context
  const [{ userJWTCookie }] = useGlobalStateValue();

  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGoToLoginPage = () => {
    navigate('/login');
  }

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  }

  const handleScrollToTop = () => {
    navigate('/');
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  return (
    <header className={`landingpage__header ${isScrolled ? 'scrolled' : 'expanded'}`}>
      <div className='header-content'>
        <div className="app-branding">
          <button className='app-icon-and-text' onClick={handleScrollToTop}>
            <img src={process.env.PUBLIC_URL + '/NotionWallet_icon.png'} alt=''></img>
            <div className="app-name">
              <span>Notion</span>
              <span className='wallet-part'>Wallet</span>
            </div>
          </button>
          <a href='https://www.notion.so' className="made-for-notion">
            <img src={process.env.PUBLIC_URL + '/made_for_notion.png'} alt="Notion Icon" />
          </a>
        </div>
        <nav className="header-nav">
          {userJWTCookie !== "" ? ( // User is logged in
            <button className="login-button" onClick={handleGoToDashboard}>
              <span className="login-text-full">My Dashboard</span>
              <span className="login-text-short">Dashboard</span>
            </button>
          ) : (                     // User is not logged in
            <button className="login-button" onClick={handleGoToLoginPage}>
              <span className="login-text-full">Login</span>
              <span className="login-text-short">Login</span>
            </button>
          )}
        </nav>
      </div>
    </header >
  );
}

export default LandingPageHeader;