import '../../css/BillingLimitErrorBox.css';
import { useGlobalStateValue } from '../../context/GlobalStateProvider';
import { actionTypes, BOX_TYPES } from '../../context/globalReducer';

function BillingLimitErrorBox({ onClose, limitType }) {
    const [, dispatch] = useGlobalStateValue();

    const handleOpenBillingPanel = () => {
        dispatch({
            type: actionTypes.SET_ACTIVE_BOX,
            value: {
                type: BOX_TYPES.PROFILE,
                data: { panel: 'billing' }
            }
        });
    };

    const getLimitMessage = () => {
        switch (limitType) {
            case 'MAXIMUM_GRAPH_COUNT':
                return {
                    title: 'Graph Limit Reached',
                    description: 'You\'ve reached the maximum number of graphs allowed for your current plan.',
                    icon: '📊'
                };
            case 'MAXIMUM_GRAPH_LIST':
                return {
                    title: 'Graph List Limit Reached',
                    description: 'You\'ve reached the maximum number of graphs you can have in your list for your current plan.',
                    icon: '📋'
                };
            case 'MAXIMUM_GRAPH_REFRESH_COUNT':
                return {
                    title: 'Refresh Limit Reached',
                    description: 'You\'ve reached the maximum number of graph refreshes allowed for your current plan this billing period.',
                    icon: '🔄'
                };
            default:
                return {
                    title: 'Billing Limit Reached',
                    description: 'You\'ve reached a billing limit for your current plan.',
                    icon: '⚠️'
                };
        }
    };

    const limitInfo = getLimitMessage();

    return (
        <div className='box__backdrop'>
            <div className="billinglimiterrorbox__container" onClick={e => { e.stopPropagation(); }}>
                <div className="billinglimiterrorbox__header">
                    <span className="billinglimiterrorbox__icon">{limitInfo.icon}</span>
                    <h2>{limitInfo.title}</h2>
                </div>

                <div className="billinglimiterrorbox__content">
                    <p className="billinglimiterrorbox__message">
                        {limitInfo.description}
                    </p>
                    <p className="billinglimiterrorbox__upgrade-message">
                        Upgrade your plan to get:
                    </p>
                    <ul className="billinglimiterrorbox__benefits">
                        <li>More graphs and refreshes</li>
                        <li>Advanced analytics features</li>
                        <li>Priority support</li>
                    </ul>
                </div>

                <div className="billinglimiterrorbox__actions">
                    <button
                        className="billinglimiterrorbox__button billinglimiterrorbox__button--primary"
                        onClick={handleOpenBillingPanel}
                    >
                        <span>View Plans & Upgrade</span>
                    </button>

                    <button
                        className="billinglimiterrorbox__button billinglimiterrorbox__button--secondary"
                        onClick={onClose}
                    >
                        <span>Close</span>
                    </button>
                </div>

                <p className="billinglimiterrorbox__footer">
                    Need help choosing a plan? Check our pricing page for details.
                </p>
            </div>
        </div>
    );
}

export default BillingLimitErrorBox;

