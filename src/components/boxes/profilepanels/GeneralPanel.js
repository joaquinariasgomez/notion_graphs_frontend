import { useState } from "react";
import { logoutFromNotion } from "../../../api/RequestUtils";
import { useGlobalStateValue } from "../../../context/GlobalStateProvider";
import { useCookie } from "../../../useCookie";
import { useLocalStorage } from "../../../useLocalStorage";
import ClipLoader from "react-spinners/ClipLoader";

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
    <>
      <div className='profilebox__header'>
        <h2>👋 {userSessionDetails.name}</h2>
      </div>
      <div className='profilebox__footer'>
        <button className='profilebox__button cancel' onClick={onClose}>
          Cancel
        </button>
        <button className='profilebox__button logout' onClick={logOut}>
          {isLoggingOut ? <ClipLoader size={15} /> : 'Logout'}
        </button>
      </div>
    </>
  );
}