import { useState, useEffect } from "react";
import { useGlobalStateValue } from './context/GlobalStateProvider';
import { actionTypes } from './context/globalReducer';

export const useCookie = (cookieName) => {
  const [cookieValue, setCookieValue] = useState("");
  const [{ userJWTCookie }, dispatch] = useGlobalStateValue();

  useEffect(() => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${cookieName}`));

    setCookieValue(cookie ? cookie.split("=")[1] : "");
  }, [cookieName]);

  const setUserJWTCookie = (value, days) => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);
    document.cookie = `${cookieName}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
    dispatch({
      type: actionTypes.SET_USER_JWT_COOKIE,
      value: value
    })
  };

  const deleteUserJWTCookie = () => {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    dispatch({
      type: actionTypes.SET_USER_JWT_COOKIE,
      value: ""
    })
  };

  return [cookieValue, setUserJWTCookie, deleteUserJWTCookie];
}