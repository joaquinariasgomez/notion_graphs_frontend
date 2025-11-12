import { useEffect, useState } from "react";
import { useGlobalStateValue } from "../../context/GlobalStateProvider";
import CreateGraphBox from "./CreateGraphBox";
import ProfileBox from "./ProfileBox";
import eventBus from "../../utils/eventBus";
import UnknownErrorBox from "./UnknownErrorBox";
import UpdateGraphConfigurationBox from "./UpdateGraphConfigurationBox";

export default function BoxManager() {

  // Context
  const [{ showCreateGraphBox, showUserProfileBox, showNotionConnectionBox, showUpdateGraphConfigurationBox }, dispatch] = useGlobalStateValue();
  const [showUnknownErrorBox, setShowUnknownErrorBox] = useState(false);

  useEffect(() => {
    const handleUnknownError = () => {
      setShowUnknownErrorBox(true);
    };

    // Subscribe to the event when the component mounts
    eventBus.on('unknownError', handleUnknownError);

    // Unsubscribe from the event when the component unmounts
    return () => {
      eventBus.off('unknownError', handleUnknownError);
    };
  }, []);

  // Hide UnknownErrorBox when NotionConnectionBox is shown
  useEffect(() => {
    if (showNotionConnectionBox) {
      setShowUnknownErrorBox(false);
    }
  }, [showNotionConnectionBox]);

  // TODO: if it is an alert box, render it before the other boxes
  const isAlertBox = () => {

  }

  const renderBox = () => {
    if (showUnknownErrorBox) {
      return (
        <UnknownErrorBox onClose={() => setShowUnknownErrorBox(false)} />
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