import '../../css/ProfileBox.css';
import { useEffect, useState } from 'react';
import { actionTypes } from '../../context/globalReducer';
import { useGlobalStateValue } from '../../context/GlobalStateProvider';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import GeneralPanel from './profilepanels/GeneralPanel';
import WalletConnectionPanel from './profilepanels/WalletConnectionPanel';
import BillingPanel from './profilepanels/BillingPanel';
import { getBillingGraphCount, getBillingPlan } from '../../api/RequestUtils';

function ProfileBox({ defaultActivePanel, showHowConnectionModal = false }) {

  // Context
  const [{ userJWTCookie }, dispatch] = useGlobalStateValue();

  const [activePanel, setActivePanel] = useState(defaultActivePanel);

  const closeBox = () => {
    dispatch({
      type: actionTypes.CLOSE_ACTIVE_BOX
    });
  }

  useEffect(() => {
    refreshAllBillingData();
  }, []);

  const refreshAllBillingData = async () => {
    try {
      await Promise.all([
        fetchBillingGraphCount(),
        fetchBillingPlan()
      ]);
    } catch (error) {

    }
  }

  const fetchBillingGraphCount = async () => {
    try {
      const apiResponse = await getBillingGraphCount(userJWTCookie);
      if (apiResponse) {
        dispatch({
          type: actionTypes.SET_BILLING_GRAPH_COUNT_DATA,
          value: apiResponse
        })
      }
    } catch (error) {

    }
  }

  const fetchBillingPlan = async () => {
    try {
      const apiResponse = await getBillingPlan(userJWTCookie);
      if (apiResponse) {
        dispatch({
          type: actionTypes.SET_BILLING_PLAN,
          value: apiResponse.plan
        })
      }
    } catch (error) {

    }
  }

  const renderActivePanel = () => {
    switch (activePanel) {
      default:
      case 'general':
        return (
          <GeneralPanel onClose={closeBox} />
        );
      case 'walletconnection':
        return (
          <WalletConnectionPanel onClose={closeBox} autoShowHowConnectionModal={showHowConnectionModal} />
        );
      case 'billing':
        return (
          <BillingPanel onClose={closeBox} />
        );
    }
  }

  return (
    <div className='box__backdrop' onClick={closeBox}>
      <div className='profilebox__container' onClick={e => { e.stopPropagation(); }}>
        <button className='profilebox__cancelbutton' onClick={closeBox}>
          <CloseRoundedIcon fontSize='medium' />
        </button>
        <div className='profilebox__sidebar'>
          <div className='profilebox__sidebar-header'>
            <h4>Settings</h4>
          </div>
          <div
            className={`profilebox__sidebar-item ${activePanel === 'general' ? 'active' : ''}`}
            onClick={() => setActivePanel('general')}
          >
            General
          </div>
          <div
            className={`profilebox__sidebar-item ${activePanel === 'walletconnection' ? 'active' : ''}`}
            onClick={() => setActivePanel('walletconnection')}
          >
            Notion connection
          </div>
          <div
            className={`profilebox__sidebar-item ${activePanel === 'billing' ? 'active' : ''}`}
            onClick={() => setActivePanel('billing')}
          >
            Billing
          </div>
          {/* Add more items here like "Notifications", etc. */}
        </div>
        <div className='profilebox__content'>
          {renderActivePanel()}
        </div>
      </div>
    </div >
  );
}

export default ProfileBox;