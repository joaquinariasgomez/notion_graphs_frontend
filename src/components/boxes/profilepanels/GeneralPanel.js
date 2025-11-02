import { useState } from "react";
import { logoutFromNotion } from "../../../api/RequestUtils";
import { useGlobalStateValue } from "../../../context/GlobalStateProvider";
import { useCookie } from "../../../useCookie";
import { useLocalStorage } from "../../../useLocalStorage";
import ClipLoader from "react-spinners/ClipLoader";
import { renderUserImage } from "../../../utils/Utils";

export default function GeneralPanel({ onClose }) {

  // Context
  const [{ userSessionDetails }, dispatch] = useGlobalStateValue();

  const [userJWTCookie, setUserJWTCookie, deleteUserJWTCookie] = useCookie("userJWT");
  const [userSessionDetailsValue, setUserSessionDetailsValue, deleteUserSessionDetailsValue] = useLocalStorage("userSessionDetails");

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logOut = async () => {
    try {
      setIsLoggingOut(true);
      await logoutFromNotion(userJWTCookie);
    } catch (error) {

    } finally {
      setIsLoggingOut(false);
    }
    // Delete cookie and local storage
    deleteUserJWTCookie();
    deleteUserSessionDetailsValue();
  }

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