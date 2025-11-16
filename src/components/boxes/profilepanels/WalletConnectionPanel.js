import { useState } from "react";
import { useGlobalStateValue } from "../../../context/GlobalStateProvider";
import { refreshIntegrationConnection } from "../../../api/RequestUtils";
import { actionTypes } from "../../../context/globalReducer";
import { FaSyncAlt } from 'react-icons/fa';

export default function WalletConnectionPanel({ onClose }) {

  const authorization_url = process.env.REACT_APP_NOTION_AUTH_URL;

  // Context
  const [{ userJWTCookie, templateConnectedToIntegrationData, userSessionDetails }, dispatch] = useGlobalStateValue();

  const [isRefreshingIntegrationConnection, setIsRefreshingIntegrationConnection] = useState(false);

  const renderConnectionStatusText = () => {
    if (templateConnectedToIntegrationData.hasTemplateConnectedToIntegration) {
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
          Your integration is successfully connected.
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
          No databases connected to your account.
        </p>
      );
    }
  }

  const renderConfigureNotionIntegrationText = () => {
    if (templateConnectedToIntegrationData.hasTemplateConnectedToIntegration) {
      return (<span>Configure Notion integration</span>);
    } else {
      return (<span>Connect Notion integration</span>);
    }
  }

  const refreshIntegrationCon = async () => {
    try {
      setIsRefreshingIntegrationConnection(true);
      const apiResponse = await refreshIntegrationConnection(userJWTCookie);
      if (apiResponse) {
        dispatch({
          type: actionTypes.SET_TEMPLATE_CONNECTED_TO_INTEGRATION_DATA,
          value: apiResponse
        })
      }
    } catch (error) {

    } finally {
      setIsRefreshingIntegrationConnection(false);
    }
  }

  return (
    <div className="walletconnectionpanel">
      <div className="info__container">
        {renderConnectionStatusText()}
        <button onClick={refreshIntegrationCon} disabled={isRefreshingIntegrationConnection}>
          <FaSyncAlt className={`refresh-button__icon ${isRefreshingIntegrationConnection ? 'spinning' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>
      <div className="info__container">
        <p>
          <span
            style={{
              fontSize: '1.2em',
              marginRight: '0.5em',
              verticalAlign: 'middle'
            }}
          >
            ℹ️
          </span>
          Newly connected integrations might take 1-2 minutes to reflect in your account.
        </p>
      </div>
      <div className="dualinfo__container">
        <button className="connectwithwallet" onClick={() => { window.location.href = authorization_url; }}>
          <img src={process.env.PUBLIC_URL + '/notion_logo.png'} alt=''></img>
          {renderConfigureNotionIntegrationText()}
        </button>
        <button className="howtoconnect">
          <span>How connection works</span>
        </button>
      </div>
    </div>
  );
}