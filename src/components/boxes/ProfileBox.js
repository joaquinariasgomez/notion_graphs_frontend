import '../../css/ProfileBox.css';
import { useState } from 'react';
import { actionTypes } from '../../context/globalReducer';
import { useGlobalStateValue } from '../../context/GlobalStateProvider';
import { useCookie } from '../../useCookie';
import { useLocalStorage } from '../../useLocalStorage';
import { logoutFromNotion } from '../../RequestUtils';
import ClipLoader from "react-spinners/ClipLoader";

function ProfileBox() {

  const [userJWTCookie, setUserJWTCookie, deleteUserJWTCookie] = useCookie("userJWT");
  const [userSessionDetailsValue, setUserSessionDetailsValue, deleteUserSessionDetailsValue] = useLocalStorage("userSessionDetails");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Context
  const [{ userSessionDetails }, dispatch] = useGlobalStateValue();

  const closeBox = () => {
    dispatch({
      type: actionTypes.SET_SHOW_USER_PROFILE_BOX,
      value: false
    })
  }

  const logOut = async () => {
    try {
      setIsLoggingOut(true);
      await logoutFromNotion(userJWTCookie);
    } catch (error) {
      console.log(error); // TODO: remove
      // TODO: showAlert() show alert box
    } finally {
      setIsLoggingOut(false);
    }
    // Delete cookie and local storage
    deleteUserJWTCookie();
    deleteUserSessionDetailsValue();
  }

  return (
    <div className='box__backdrop' onClick={closeBox}>
      <div className='profilebox__container' onClick={e => { e.stopPropagation(); }}>
        <div className='profilebox__header'>
          <h2>👋 {userSessionDetails.name}</h2>
        </div>
        {/* TODO: craft some profilebox__body with some settings */}
        <div className='profilebox__footer'>
          <button className='profilebox__button cancel' onClick={closeBox}>
            Cancel
          </button>
          <button className='profilebox__button logout' onClick={logOut}>
            {isLoggingOut ? <ClipLoader size={15} /> : 'Logout'}
          </button>
        </div>
      </div>
    </div >
  );
}

export default ProfileBox;