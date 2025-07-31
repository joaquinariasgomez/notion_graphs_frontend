import { useState } from 'react';
import { actionTypes } from '../../context/globalReducer';
import { useGlobalStateValue } from '../../context/GlobalStateProvider';
import '../../css/ProfileBox.css';
import { useCookie } from '../../useCookie';
import { useLocalStorage } from '../../useLocalStorage';
import { logoutFromNotion } from '../../RequestUtils';

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
      console.log(error);
      // TODO: showAlert() show alert box
    } finally {
      setIsLoggingOut(false);
    }
    // Delete cookie and local storage
    deleteUserJWTCookie();
    deleteUserSessionDetailsValue();
  }

  return (
    <div className='profilebox__backdrop' onClick={closeBox}>
      <div className='profilebox__container' onClick={e => { e.stopPropagation(); }}>
        <div className='profilebox__header'>
          <h2>👋 {userSessionDetails.name}</h2>
        </div>
        {/* TODO: craft some profilebox__body with some settings */}
        <div className='profilebox__footer'>
          <button className='profilebox__cancel__button' onClick={closeBox}>
            Cancel
          </button>
          <button className='profilebox__logout__button' onClick={logOut}>
            Logout
          </button>
        </div>
      </div>
    </div >
  );
}

export default ProfileBox;