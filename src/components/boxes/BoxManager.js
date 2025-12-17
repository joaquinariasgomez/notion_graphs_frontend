import { useEffect } from "react";
import { useGlobalStateValue } from "../../context/GlobalStateProvider";
import CreateGraphBox from "./CreateGraphBox";
import ProfileBox from "./ProfileBox";
import eventBus from "../../utils/eventBus";
import UnknownErrorBox from "./UnknownErrorBox";
import BillingLimitErrorBox from "./BillingLimitErrorBox";
import ClientErrorBox from "./ClientErrorBox";
import UpdateGraphConfigurationBox from "./UpdateGraphConfigurationBox";
import { actionTypes, BOX_TYPES } from "../../context/globalReducer";
import RegisterValueBox from "./RegisterValueBox";

export default function BoxManager() {

  // Context
  const [{ activeBox }, dispatch] = useGlobalStateValue();

  useEffect(() => {
    const handleUnknownError = () => {
      dispatch({
        type: actionTypes.SET_ACTIVE_BOX,
        value: { type: BOX_TYPES.UNKNOWN_ERROR }
      });
    };

    const handleBillingLimitError = (limitType) => {
      dispatch({
        type: actionTypes.SET_ACTIVE_BOX,
        value: {
          type: BOX_TYPES.BILLING_LIMIT_ERROR,
          data: { limitType }
        }
      });
    };

    const handleClientError = (errorData) => {
      dispatch({
        type: actionTypes.SET_ACTIVE_BOX,
        value: {
          type: BOX_TYPES.CLIENT_ERROR,
          data: { errorData }
        }
      });
    };

    // Subscribe to the events when the component mounts
    eventBus.on('unknownError', handleUnknownError);
    eventBus.on('billingLimitError', handleBillingLimitError);
    eventBus.on('clientError', handleClientError);

    // Unsubscribe from the events when the component unmounts
    return () => {
      eventBus.off('unknownError', handleUnknownError);
      eventBus.off('billingLimitError', handleBillingLimitError);
      eventBus.off('clientError', handleClientError);
    };
  }, [dispatch]);

  const handleCloseBox = () => {
    dispatch({ type: actionTypes.CLOSE_ACTIVE_BOX });
  };
  // Lock body scroll when any box is open
  useEffect(() => {
    const isAnyBoxOpen = activeBox != null;

    if (isAnyBoxOpen) {
      // Lock scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Restore scroll
      document.body.style.overflow = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeBox]);

  const renderBox = () => {
    if (!activeBox) return null;

    switch (activeBox.type) {
      case BOX_TYPES.BILLING_LIMIT_ERROR:
        return (
          <BillingLimitErrorBox
            onClose={handleCloseBox}
            limitType={activeBox.data?.limitType}
          />
        );

      case BOX_TYPES.UNKNOWN_ERROR:
        return (
          <UnknownErrorBox onClose={handleCloseBox} />
        );

      case BOX_TYPES.CLIENT_ERROR:
        return (
          <ClientErrorBox
            onClose={handleCloseBox}
            errorData={activeBox.data?.errorData}
          />
        );

      case BOX_TYPES.PROFILE:
        return (
          <ProfileBox
            defaultActivePanel={activeBox.data?.panel || 'general'}
            showHowConnectionModal={activeBox.data?.showHowConnectionModal || false}
          />
        );

      case BOX_TYPES.CREATE_GRAPH:
        return (
          <CreateGraphBox />
        );

      case BOX_TYPES.UPDATE_GRAPH:
        return (
          <UpdateGraphConfigurationBox />
        );

      case BOX_TYPES.REGISTER_VALUE:
        return (
          <RegisterValueBox
            valueType={activeBox.data?.valueType}
          />
        );

      default:
        return null;
    }
  };

  return renderBox();
}