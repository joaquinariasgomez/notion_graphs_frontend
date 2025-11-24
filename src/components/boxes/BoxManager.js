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

  // Lock body scroll when any box is open
  useEffect(() => {
    const isAnyBoxOpen = showSessionExpiredBox || showUserProfileBox || showNotionConnectionBox || showCreateGraphBox || showUpdateGraphConfigurationBox;

    if (isAnyBoxOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;

      // Lock scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      // Restore scroll
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';

      // Restore scroll position
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [showSessionExpiredBox, showUserProfileBox, showNotionConnectionBox, showCreateGraphBox, showUpdateGraphConfigurationBox]);

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