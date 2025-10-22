import { useState } from "react";
import { useGlobalStateValue } from "../../../context/GlobalStateProvider";
import { refreshIntegrationConnection } from "../../../api/RequestUtils";
import { actionTypes } from "../../../context/globalReducer";

export default function WalletConnectionPanel({ onClose }) {

  // Context
  const [{ userJWTCookie, hasTemplateConnectedToIntegration, userSessionDetails }, dispatch] = useGlobalStateValue();

  const [isRefreshingIntegrationConnection, setIsRefreshingIntegrationConnection] = useState(false);

  const renderConnectionStatusText = () => {
    if (hasTemplateConnectedToIntegration) {
      return (
        <p>
          <span
            style={{
              fontSize: '1.2em',
              marginRight: '0.5em',
              verticalAlign: 'middle'
            }}
          >
            ✅
          </span>
          Your databases are successfully connected
        </p>
      );
    } else {
      return (
        <p>
          <span
            style={{
              fontSize: '1.2em',
              marginRight: '0.5em',
              verticalAlign: 'middle'
            }}
          >
            ⚠️
          </span>
          No databases connected to your account
        </p>
      );
    }
  }

  const refreshIntegrationCon = async () => {
    try {
      setIsRefreshingIntegrationConnection(true);
      const apiResponse = await refreshIntegrationConnection(userJWTCookie);
      if (apiResponse) {
        dispatch({
          type: actionTypes.SET_HAS_TEMPLATE_CONNECTED_TO_INTEGRATION,
          value: apiResponse.hasTemplateConnectedToIntegration
        })
      }
    } catch (error) {

    } finally {
      setIsRefreshingIntegrationConnection(false);
    }
  }

  return (
    <div className="walletconnectionpanel">
      <div className="checkconnection__container">
        {renderConnectionStatusText()}
        <button onClick={refreshIntegrationCon}>
          Refresh
        </button>
      </div>
    </div>
  );
}