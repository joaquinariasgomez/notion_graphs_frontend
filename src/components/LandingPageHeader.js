import { useState, useEffect } from 'react';
import '../css/LandingPage.css';

function LandingPageHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLoginWithNotion = () => {
    const authorization_url = process.env.REACT_APP_NOTION_AUTH_URL;
    window.location.href = authorization_url;
  }

  const handleScrollToTop = () => {
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
          <button className="login-with-notion" onClick={handleLoginWithNotion}>
            <img src={process.env.PUBLIC_URL + '/notion_logo.png'} alt=''></img>
            <span className="login-text-full">Login with Notion</span>
            <span className="login-text-short">Login</span>
          </button>
        </nav>
      </div>
    </header >
  );
}

export default LandingPageHeader;