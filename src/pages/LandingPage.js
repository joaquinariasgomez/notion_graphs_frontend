import { useEffect, useState } from 'react';
import '../css/LandingPage.css';
import { useNavigate } from 'react-router-dom';
import { useCookie } from '../useCookie';
import { loginToNotionWithCode } from '../api/RequestUtils';
import { useLocalStorage } from '../useLocalStorage';
import LandingPageFooter from '../components/LandingPageFooter';
import ClipLoader from "react-spinners/ClipLoader";
import LandingPageHeader from '../components/LandingPageHeader';

function LandingPage() {

  const [userJWTCookie, setUserJWTCookie, deleteUserJWTCookie] = useCookie("userJWT");
  const [userSessionDetailsValue, setUserSessionDetailsValue, deleteUserSessionDetailsValue] = useLocalStorage("userSessionDetails");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

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
    const params = new URL(window.document.location).searchParams;
    const notionCode = params.get("code");
    if (!notionCode) return;
    // Clean up Notion code from URL
    window.history.replaceState(null, '', window.location.pathname);
    getLoginDataFromNotion(notionCode);
  }, []);

  // Title timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTitle((prevTitle) => (prevTitle + 1) % titleStyles.length);
    }, ANIMATION_INTERNAL);

    return () => clearInterval(interval);
  }, []);

  const handleLoginWithNotion = () => {
    const authorization_url = process.env.REACT_APP_NOTION_AUTH_URL;
    window.location.href = authorization_url;
  }

  const getLoginDataFromNotion = async (notionCode) => {
    try {
      setIsLoggingIn(true);
      const apiResponse = await loginToNotionWithCode(notionCode);
      if (apiResponse) {
        setUserJWTCookie(apiResponse.session_jwt, 7);
        setUserSessionDetailsValue(apiResponse.owner.user);
      }
    } catch (error) {
      // TODO: showAlert() show alert box
    } finally {
      setIsLoggingIn(false);
    }
  }

  const renderContent = () => {
    if (isLoggingIn) {
      return renderIsLoggingInScreen();
    } else {
      return renderLandingPage();
    }
  }

  const renderLandingPage = () => {
    return (
      // <div className="landingpage__backgroundwrapper">
      //   <div className='landingpage__content'>
      //     <div className='landingpage__body'>
      //       <a className='landingpage__builtbyjoaquin__button' href='https://www.joaquinariasgomez.com/' target="_blank">
      //         Built by Joaquín
      //       </a>
      //       <h1 className='landingpage__title'>
      //         Turn your finance Notion databases
      //         <br></br>
      //         into insightful graphs
      //       </h1>
      //       <p className='landingpage__subtitle'>
      //         Create automatically-updating graphs from your Notion account with no code.
      //       </p>
      //       <a className='landingpage__loginbutton' href={authorization_url}>
      //         <p>Login with Notion</p>
      //         <img src={process.env.PUBLIC_URL + '/notion_logo.png'} alt=''></img>
      //       </a>
      //     </div>
      //     <LandingPageFooter />
      //   </div>
      // </div>
      <div className='landingpage__base'>
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
              <h1 className='static-title'>into insightful graphs</h1>
              <p>
                Control your digital wallet through a unified dashboard, using your Notion data.
              </p>
              <div>
                <button className="login-with-notion-2" onClick={handleLoginWithNotion}>
                  <img src={process.env.PUBLIC_URL + '/notion_logo.png'} alt=''></img>
                  <span>Login with Notion</span>
                </button>
              </div>
              <div className='small-subtext'>
                <p>No signup required</p>
              </div>
            </div>
          </main>
          {/* <LandingPageFooter /> */}
        </div>
      </div>
    );
  }

  const renderIsLoggingInScreen = () => {
    return (
      <div className='logging_in'>
        <ClipLoader size={50} />
      </div>
    );
  }

  return renderContent();
}

export default LandingPage;