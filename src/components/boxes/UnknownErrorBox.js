import '../../css/UnknownErrorBox.css';
import { useGlobalStateValue } from '../../context/GlobalStateProvider';
import { actionTypes, BOX_TYPES } from '../../context/globalReducer';

function UnknownErrorBox({ onClose }) {
    const authorization_url = process.env.REACT_APP_NOTION_AUTH_URL;
    const [, dispatch] = useGlobalStateValue();

    const handleOpenNotionConnectionPanel = () => {
        dispatch({
            type: actionTypes.SET_ACTIVE_BOX,
            value: {
                type: BOX_TYPES.PROFILE,
                data: { panel: 'walletconnection' }
            }
        });
    };

    const handleReconnectNotion = () => {
        onClose(); // Hide the box before redirecting
        window.location.href = authorization_url;
    };

    return (
        <div className='box__backdrop'>
            <div className="unknownerrorbox__container" onClick={e => { e.stopPropagation(); }}>
                <div className="unknownerrorbox__header">
                    <span className="unknownerrorbox__icon">⚠️</span>
                    <h2>Unknown error</h2>
                </div>

                <div className="unknownerrorbox__content">
                    <p className="unknownerrorbox__message">
                        We had an unknown error. This could be because:
                    </p>
                    <ul className="unknownerrorbox__reasons">
                        <li>Your session has expired</li>
                        <li>Your Notion integration needs to be reconnected</li>
                        <li>There was a connection error</li>
                    </ul>
                </div>

                <div className="unknownerrorbox__actions">
                    <button
                        className="unknownerrorbox__button unknownerrorbox__button--primary"
                        onClick={handleReconnectNotion}
                    >
                        <span>Reconnect with Notion</span>
                    </button>

                    <button
                        className="unknownerrorbox__button unknownerrorbox__button--secondary"
                        onClick={handleOpenNotionConnectionPanel}
                    >
                        <span>Check Notion Connection Status</span>
                    </button>
                </div>

                <p className="unknownerrorbox__footer">
                    Need help? Try refreshing the page.
                </p>
            </div>
        </div>
    );
}

export default UnknownErrorBox;