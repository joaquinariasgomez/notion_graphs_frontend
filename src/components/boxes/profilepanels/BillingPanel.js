import { useState } from "react";
import { useGlobalStateValue } from "../../../context/GlobalStateProvider";
import { useNavigate } from "react-router-dom";
import { actionTypes } from "../../../context/globalReducer";

export default function BillingPanel({ onClose }) {

  // Context
  const [{ userSessionDetails, userJWTCookie }, dispatch] = useGlobalStateValue();

  const navigate = useNavigate();

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

  return (
    <div className="billingpanel">

    </div>
  );
}