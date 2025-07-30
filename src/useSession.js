import { useEffect, useState } from "react"
import { useGlobalStateValue } from "./context/GlobalStateProvider";
import { actionTypes } from "./context/globalReducer";

export const useSession = (sessionKey) => {
  const [sessionValue, setSessionValue] = useState({});
  const [{ userSessionDetails }, dispatch] = useGlobalStateValue();

  useEffect(() => {
    const currentValue = JSON.parse(localStorage.getItem(sessionKey));
    setSessionValue(currentValue ? currentValue : {});
  }, [sessionKey]);

  const setSessionStorage = (value) => {
    localStorage.setItem(sessionKey, JSON.stringify(value));
    dispatch({
      type: actionTypes.SET_USER_SESSION_DETAILS,
      value: value
    });
  }

  const deleteSessionStorage = () => {
    localStorage.removeItem(sessionKey);
    dispatch({
      type: actionTypes.SET_USER_SESSION_DETAILS,
      value: {}
    });
  }

  return [sessionValue, setSessionStorage, deleteSessionStorage];
}