import { useEffect, useState } from "react";
import { useGlobalStateValue } from "../../context/GlobalStateProvider";
import CreateGraphBox from "./CreateGraphBox";
import ProfileBox from "./ProfileBox";
import eventBus from "../../utils/eventBus";
import SessionExpiredBox from "./SessionExpiredBox";
import UpdateGraphConfigurationBox from "./UpdateGraphConfigurationBox";

export default function BoxManager() {

  // Context
  const [{ showCreateGraphBox, showUserProfileBox, showNotionConnectionBox, showUpdateGraphConfigurationBox }, dispatch] = useGlobalStateValue();
  const [showSessionExpiredBox, setShowSessionExpiredBox] = useState(false);

  useEffect(() => {
    const handleSessionExpired = () => {
      setShowSessionExpiredBox(true);
    };

    // Subscribe to the event when the component mounts
    eventBus.on('sessionExpired', handleSessionExpired);

    // Unsubscribe from the event when the component unmounts
    return () => {
      eventBus.off('sessionExpired', handleSessionExpired);
    };
  }, []);

  // TODO: if it is an alert box, render it before the other boxes
  const isAlertBox = () => {

  }

  const renderBox = () => {
    if (showSessionExpiredBox) {
      return (
        <SessionExpiredBox />
      );
    } else if (showUserProfileBox) {
      return (
        <ProfileBox defaultActivePanel={'general'} />
      )
    } else if (showNotionConnectionBox) {
      return (
        <ProfileBox defaultActivePanel={'walletconnection'} />
      )
    } else if (showCreateGraphBox) {
      return (
        <CreateGraphBox />
      )
    } else if (showUpdateGraphConfigurationBox) {
      return (
        <UpdateGraphConfigurationBox />
      )
    }
  }

  return renderBox();
}