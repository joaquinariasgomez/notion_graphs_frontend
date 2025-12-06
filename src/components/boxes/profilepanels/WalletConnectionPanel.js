import { useState } from "react";
import { useGlobalStateValue } from "../../../context/GlobalStateProvider";
import { refreshIntegrationConnection, unlinkIntegrationConnection } from "../../../api/RequestUtils";
import { actionTypes } from "../../../context/globalReducer";
import { FaSyncAlt, FaTrashAlt } from 'react-icons/fa';
import PersonIcon from '@mui/icons-material/Person';
import HowConnectionWorksModal from "../HowConnectionWorksModal";

export default function WalletConnectionPanel({ onClose, autoShowHowConnectionModal = false }) {

  const authorization_url = process.env.REACT_APP_NOTION_AUTH_URL;

  // Context
  const [{ userJWTCookie, templateConnectedToIntegrationData, userSessionDetails }, dispatch] = useGlobalStateValue();

  const [isRefreshingIntegrationConnection, setIsRefreshingIntegrationConnection] = useState(false);
  const [isUnlinkingIntegrationConnection, setIsUnlinkingIntegrationConnection] = useState(false);
  const [showHowConnectionWorksModal, setShowHowConnectionWorksModal] = useState(autoShowHowConnectionModal);

  const renderConnectionStatusText = () => {
    if (templateConnectedToIntegrationData?.hasTemplateConnectedToIntegration) {
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
          No integration connected to your account.
        </p>
      );
    }
  }

  const renderConfigureNotionIntegrationText = () => {
    if (templateConnectedToIntegrationData?.hasTemplateConnectedToIntegration) {
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

  const unlinkNotionIntegration = async () => {
    try {
      setIsUnlinkingIntegrationConnection(true);
      await unlinkIntegrationConnection(userJWTCookie);
      // If no error is thrown, the unlink was successful - update state
      dispatch({
        type: actionTypes.SET_TEMPLATE_CONNECTED_TO_INTEGRATION_DATA,
        value: {}
      })
    } catch (error) {

    } finally {
      setIsUnlinkingIntegrationConnection(false);
    }
  }

  const renderNotionAvatar = () => {
    if (templateConnectedToIntegrationData.notionAvatarUrl == null || templateConnectedToIntegrationData.notionAvatarUrl == undefined) {
      return (
        <PersonIcon fontSize='large' />
      );
    } else {
      return (
        <img
          src={templateConnectedToIntegrationData.notionAvatarUrl}
          alt="Notion Avatar"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      );
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
      {templateConnectedToIntegrationData?.hasTemplateConnectedToIntegration && (
        <div className="userinfo__container">
          <div className="userinfo__avatar">
            {renderNotionAvatar()}
          </div>
          <div className="userinfo__details">
            <div className="userinfo__name">{templateConnectedToIntegrationData.notionName}</div>
            <div className="userinfo__email">{templateConnectedToIntegrationData.notionEmail}</div>
          </div>
          <button className="userinfo__unlink-button" onClick={unlinkNotionIntegration} disabled={isUnlinkingIntegrationConnection}>
            <FaTrashAlt className={`unlink-button__icon ${isUnlinkingIntegrationConnection ? 'unlinking' : ''}`} />
            <span>Unlink integration</span>
          </button>
        </div>
      )}
      <div className="dualinfo__container">
        <button className="connectwithwallet" onClick={() => { window.location.href = authorization_url; }}>
          <img src={process.env.PUBLIC_URL + '/notion_logo.png'} alt=''></img>
          {renderConfigureNotionIntegrationText()}
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