import '../../css/ProfileBox.css';
import { useState } from 'react';
import { actionTypes } from '../../context/globalReducer';
import { useGlobalStateValue } from '../../context/GlobalStateProvider';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import GeneralPanel from './profilepanels/GeneralPanel';
import WalletConnectionPanel from './profilepanels/WalletConnectionPanel';
import BillingPanel from './profilepanels/BillingPanel';

function ProfileBox({ defaultActivePanel }) {

  // Context
  const [{ }, dispatch] = useGlobalStateValue();

  const [activePanel, setActivePanel] = useState(defaultActivePanel);

  const closeBox = () => {
    dispatch({
      type: actionTypes.SET_SHOW_USER_PROFILE_BOX,
      value: false
    })
    dispatch({
      type: actionTypes.SET_SHOW_NOTION_CONNECTION_BOX,
      value: false
    })
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
          <WalletConnectionPanel onClose={closeBox} />
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