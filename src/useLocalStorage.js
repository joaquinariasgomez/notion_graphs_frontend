import { useEffect, useState } from "react"
import { useGlobalStateValue } from "./context/GlobalStateProvider";
import { actionTypes } from "./context/globalReducer";

export const useLocalStorage = (sessionKey) => {
  const [sessionValue, setSessionValue] = useState({});
  const [{ userSessionDetails }, dispatch] = useGlobalStateValue();

  useEffect(() => {
    const currentValue = JSON.parse(localStorage.getItem(sessionKey));
    setSessionValue(currentValue ? currentValue : {});
  }, [sessionKey]);

  const setLocalStorage = (value) => {
    localStorage.setItem(sessionKey, JSON.stringify(value));
    dispatch({
      type: actionTypes.SET_USER_SESSION_DETAILS,
      value: value
    });
  }

  const deleteLocalStorage = () => {
    localStorage.removeItem(sessionKey);
    dispatch({
      type: actionTypes.SET_USER_SESSION_DETAILS,
      value: {}
    });
  }

  return [sessionValue, setLocalStorage, deleteLocalStorage];
}