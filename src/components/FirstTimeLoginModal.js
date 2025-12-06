import '../css/FirstTimeLoginModal.css';
import { useGlobalStateValue } from '../context/GlobalStateProvider';
import { actionTypes, BOX_TYPES } from '../context/globalReducer';

function FirstTimeLoginModal({ onClose, onConnectNotion }) {

  const [, dispatch] = useGlobalStateValue();

  const handleConnectNotion = () => {
    const authorization_url = process.env.REACT_APP_NOTION_AUTH_URL;
    window.location.href = authorization_url;
  };

  const handleLearnHowToConnect = () => {
    onClose();
    dispatch({
      type: actionTypes.SET_ACTIVE_BOX,
      value: {
        type: BOX_TYPES.PROFILE,
        data: {
          panel: 'walletconnection',
          showHowConnectionModal: true
        }
      }
    });
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <div className="first-time-modal-overlay">
      <div className="first-time-modal">
        <div className="first-time-modal-content">
          <div className="first-time-modal-icon">
            🎉
          </div>

          <h2 className="first-time-modal-title">Welcome to Notion Wallet!</h2>

          <p className="first-time-modal-message">
            To get started, you'll need to connect your Notion workspace.
            This allows us to access your financial databases and create beautiful charts for you.
          </p>

          <div className="first-time-modal-steps">
            <div className="modal-step">
              <div className="step-number">1</div>
              <div className="step-text">Connect your Notion workspace</div>
            </div>
            <div className="modal-step">
              <div className="step-number">2</div>
              <div className="step-text">Select which databases to share</div>
            </div>
            <div className="modal-step">
              <div className="step-number">3</div>
              <div className="step-text">Start visualizing your finances</div>
            </div>
          </div>

          <div className="first-time-modal-buttons">
            <button
              className="connect-notion-button"
              onClick={handleConnectNotion}
            >
              <img
                src={process.env.PUBLIC_URL + '/notion_logo.png'}
                alt="Notion Logo"
                className="button-notion-icon"
              />
              <span>Connect with Notion</span>
            </button>

            <button
              className="learn-how-button"
              onClick={handleLearnHowToConnect}
            >
              Learn how to Connect
            </button>

            <button
              className="skip-button"
              onClick={handleSkip}
            >
              I'll do this later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FirstTimeLoginModal;

