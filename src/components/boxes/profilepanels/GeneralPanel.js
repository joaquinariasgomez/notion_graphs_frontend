import { useState } from "react";
import { logoutFromSystem } from "../../../api/RequestUtils";
import { useGlobalStateValue } from "../../../context/GlobalStateProvider";
import { useCookie } from "../../../useCookie";
import { useLocalStorage } from "../../../useLocalStorage";
import ClipLoader from "react-spinners/ClipLoader";
import { renderUserImage } from "../../../utils/Utils";
import { useNavigate } from "react-router-dom";
import { actionTypes } from "../../../context/globalReducer";

export default function GeneralPanel({ onClose }) {

  // Context
  const [{ userSessionDetails, userJWTCookie }, dispatch] = useGlobalStateValue();

  const navigate = useNavigate();
  const [, , deleteUserJWTCookie] = useCookie("userJWT");
  const [, , deleteUserSessionDetailsValue] = useLocalStorage("userSessionDetails");

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logOut = async () => {
    try {
      setIsLoggingOut(true);
      await logoutFromSystem(userJWTCookie);
    } catch (error) {

    } finally {
      setIsLoggingOut(false);
      // Delete cookie and local storage
      deleteUserJWTCookie();
      deleteUserSessionDetailsValue();
      closeBox();
      handleBackToHome();
    }
  }

  const closeBox = () => {
    dispatch({
      type: actionTypes.SET_SHOW_USER_PROFILE_BOX,
      value: false
    })
    dispatch({
      type: actionTypes.SET_SHOW_NOTION_CONNECTION_BOX,
      value: false
    })
  }

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="generalpanel">
      <div className="userimage">
        {renderUserImage(userSessionDetails)}
      </div>
      <div className='username'>
        <h2>👋 {userSessionDetails.name}</h2>
      </div>
      <div className='logout'>
        <button className='profilebox__button logout' onClick={logOut}>
          {isLoggingOut ? <ClipLoader size={15} /> : 'Logout'}
        </button>
      </div>
    </div>
  );
}