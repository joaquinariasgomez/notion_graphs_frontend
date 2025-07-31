import { useEffect, useState } from 'react';
import '../css/LoginPage.css';
import { useNavigate } from 'react-router-dom';
import { useCookie } from '../useCookie';
import { loginToNotionWithCode } from '../RequestUtils';
import { useLocalStorage } from '../useLocalStorage';
import LandingPageFooter from '../components/LandingPageFooter';
import ClipLoader from "react-spinners/ClipLoader";

function LoginPage() {

  const authorization_url = process.env.REACT_APP_NOTION_AUTH_URL;

  const [userJWTCookie, setUserJWTCookie, deleteUserJWTCookie] = useCookie("userJWT");
  const [userSessionDetailsValue, setUserSessionDetailsValue, deleteUserSessionDetailsValue] = useLocalStorage("userSessionDetails");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const params = new URL(window.document.location).searchParams;
    const notionCode = params.get("code");
    if (!notionCode) return;
    // Clean up Notion code from URL
    window.history.replaceState(null, '', window.location.pathname);
    getLoginDataFromNotion(notionCode);
  }, []);

  const getLoginDataFromNotion = async (notionCode) => {
    try {
      setIsLoggingIn(true);
      const apiResponse = await loginToNotionWithCode(notionCode);
      if (apiResponse) {
        console.log("Actually finishing the request");
        setUserJWTCookie(apiResponse.session_jwt, 1);
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
      <div className="landingpage__backgroundwrapper">
        <div className='landingpage__content'>
          <div className='landingpage__body'>
            <a className='landingpage__builtbyjoaquin__button' href='https://www.joaquinariasgomez.com/' target="_blank">
              Built by Joaquín
            </a>
            <h1 className='landingpage__title'>
              Turn your finance Notion databases
              <br></br>
              into insightful graphs
            </h1>
            <p className='landingpage__subtitle'>
              Create automatically-updating graphs from your Notion account with no code.
            </p>
            <a className='landingpage__loginbutton' href={authorization_url}>
              <p>Login with Notion</p>
              <img src={process.env.PUBLIC_URL + '/notion_logo.png'} alt=''></img>
            </a>
          </div>
          <LandingPageFooter />
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

export default LoginPage;