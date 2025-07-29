import { useEffect } from 'react';
import '../css/LoginPage.css';
import { useNavigate } from 'react-router-dom';

function LoginPage() {

  const authorization_url = process.env.REACT_APP_NOTION_AUTH_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URL(window.document.location).searchParams;
    const notionCode = params.get("code");
    if (!notionCode) return;
    navigate("/");
    getLoginDataFromNotion(notionCode);
  }, []);

  const getLoginDataFromNotion = async (notionCode) => {
    console.log("Getting logging data from Notion with this code ", notionCode);
  }

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
        <div className='landingpage__footer'>
          This is the footer
        </div>
      </div>
    </div>
  );
}

export default LoginPage;