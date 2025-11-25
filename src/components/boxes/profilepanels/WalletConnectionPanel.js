import { useState } from "react";
import { useGlobalStateValue } from "../../../context/GlobalStateProvider";
import { refreshIntegrationConnection } from "../../../api/RequestUtils";
import { actionTypes } from "../../../context/globalReducer";
import { FaSyncAlt } from 'react-icons/fa';
import HowConnectionWorksModal from "../HowConnectionWorksModal";

export default function WalletConnectionPanel({ onClose }) {

  const authorization_url = process.env.REACT_APP_NOTION_AUTH_URL;

  // Context
  const [{ userJWTCookie, hasTemplateConnectedToIntegration, userSessionDetails }, dispatch] = useGlobalStateValue();

  const [isRefreshingIntegrationConnection, setIsRefreshingIntegrationConnection] = useState(false);
  const [showHowConnectionWorksModal, setShowHowConnectionWorksModal] = useState(false);

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
          Your databases are successfully connected.
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
          Newly connected databases might take 1-2 minutes to reflect in your account.
        </p>
      </div>
      <div className="dualinfo__container">
        <button className="connectwithwallet" onClick={() => { window.location.href = authorization_url; }}>
          <img src={process.env.PUBLIC_URL + '/notion_logo.png'} alt=''></img>
          <span>Configure Notion integration</span>
        </button>
        <button className="howtoconnect" onClick={() => setShowHowConnectionWorksModal(true)}>
          <span>How connection works</span>
        </button>
      </div>

      {showHowConnectionWorksModal && (
        <HowConnectionWorksModal onClose={() => setShowHowConnectionWorksModal(false)} />
      )}
    </div>
  );
}