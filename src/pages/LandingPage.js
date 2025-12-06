import { useEffect, useState } from 'react';
import '../css/LandingPage.css';
import { useNavigate } from 'react-router-dom';
import { useCookie } from '../useCookie';
import LandingPageFooter from '../components/LandingPageFooter';
import LandingPageHeader from '../components/LandingPageHeader';
import LandingPageCarrousel from '../components/LandingPageCarrousel';
import GraphDisplayer from '../components/graphsdisplay/GraphDisplayer';
import mockCharts from '../components/LandingPageCarrouselCharts.json';
import FeaturesSection from '../components/FeaturesSection';
import PricingSection from '../components/PricingSection';
import { useGlobalStateValue } from '../context/GlobalStateProvider';
import { actionTypes } from '../context/globalReducer';

function LandingPage() {

  const [userJWTCookieValue] = useCookie("userJWT");
  const navigate = useNavigate();

  // Context
  const [, dispatch] = useGlobalStateValue();

  const [currentTitle, setCurrentTitle] = useState(0);
  const ANIMATION_INTERNAL = 1500;  // 1.5 seconds

  const titleStyles = [
    {
      titleText: 'expenses',
      titleColor: '#D93025'
    },
    {
      titleText: 'incomes',
      titleColor: '#1E8E3E'
    },
    {
      titleText: 'savings',
      titleColor: '#1976D2'
    }
  ];

  const { titleText, titleColor } = titleStyles[currentTitle];

  useEffect(() => {
    dispatch({
      type: actionTypes.SET_USER_JWT_COOKIE,
      value: userJWTCookieValue
    })
  }, [userJWTCookieValue]);

  // Title timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTitle((prevTitle) => (prevTitle + 1) % titleStyles.length);
    }, ANIMATION_INTERNAL);

    return () => clearInterval(interval);
  }, []);

  // Handle hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }
      }
    };

    // Check hash on mount
    handleHashChange();
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleGoToLoginPage = () => {
    navigate('/login');
  }

  const handleGoToDashboardPage = () => {
    navigate('/dashboard');
  }

  return (
    <div className='landingpage__base'>
      <div className='grid-background' />
      <div className='landingpage__container'>
        <LandingPageHeader />
        <main>
          <div className='title'>
            <h1 className='dynamic-title'>
              <span>Turn your&nbsp;</span>
              <div className="dynamic-word-container">
                <span
                  key={currentTitle}
                  className="dynamic-word"
                  style={{ color: titleColor }}
                >
                  {titleText}
                </span>
              </div>
            </h1>
            <h1 className='static-title'>into insightful charts</h1>
            <p>
              Control your digital wallet through a unified dashboard, using your Notion data.
            </p>
            <div>
              {userJWTCookieValue !== "" ? (
                <button className="dashboard-button" onClick={handleGoToDashboardPage}>
                  <span>Access your dashboard</span>
                </button>
              ) : (
                <>
                  <button className="login-button-2" onClick={handleGoToLoginPage}>
                    <span>Login</span>
                  </button>
                  <div className='small-subtext'>
                    <p>No signup required</p>
                  </div>
                </>
              )}
            </div>

          </div>
          <LandingPageCarrousel>
            {mockCharts.map(chart => (
              <GraphDisplayer graphConfiguration={chart.graphConfiguration} graphData={chart.graphData} showLegend={false} showAverages={false} showStandardDeviation={false} showTitle={false} />
            ))}
          </LandingPageCarrousel>
        </main >
        <FeaturesSection />
        <PricingSection />
        <LandingPageFooter />
      </div >
    </div >
  );
}

export default LandingPage;