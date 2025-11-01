import '../css/LandingPageFooter.css';

function LandingPageFooter() {

  const currentYear = new Date().getFullYear();

  return (
    <footer className='landingpage__footer'>
      <div className='footer__content'>
        <div className='footer__section footer__brand'>
          <div className="app-icon-and-text-footer">
            <img src={process.env.PUBLIC_URL + '/NotionWallet_icon.png'} alt='NotionWallet'></img>
            <div className="app-name">
              <span>Notion</span>
              <span className='wallet-part'>Wallet</span>
            </div>
          </div>
          <p className='footer__description'>
            Transform your Notion financial data into beautiful, insightful charts.
          </p>
        </div>

        <div className='footer__section'>
          <h3>Product</h3>
          <ul>
            <li><a href="#features">Features</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="#get-started">Get Started</a></li>
          </ul>
        </div>

        <div className='footer__section'>
          <h3>Company</h3>
          <ul>
            <li><a href="#about">About Us</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="#blog">Blog</a></li>
          </ul>
        </div>

        <div className='footer__section'>
          <h3>Legal</h3>
          <ul>
            <li><a href="#terms">Terms of Service</a></li>
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#cookies">Cookie Policy</a></li>
          </ul>
        </div>
      </div>

      <div className='footer__bottom'>
        <p>&copy; {currentYear} NotionWallet. All rights reserved.</p>
        <div className='footer__made-with'>
          <span>Made for</span>
          <a href='https://www.notion.so' target='_blank' rel='noopener noreferrer'>
            <img src={process.env.PUBLIC_URL + '/made_for_notion.png'} alt="Notion" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default LandingPageFooter;