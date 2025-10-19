import '../../css/HowToConnectToIntegrationBox.css';
import { useState } from 'react';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { actionTypes } from "../../context/globalReducer";
import { useGlobalStateValue } from "../../context/GlobalStateProvider";
import { refreshIntegrationConnection } from '../../api/RequestUtils';

function HowToConnectToIntegrationBox() {

  // Context
  const [{ userJWTCookie }, dispatch] = useGlobalStateValue();

  const [isRefreshingIntegrationConnection, setIsRefreshingIntegrationConnection] = useState(false);

  const closeBox = () => {
    dispatch({
      type: actionTypes.SET_SHOW_HOW_TO_CONNECT_TO_INTEGRATION_BOX,
      value: false
    })
  }

  const refreshIntegrationCon = async () => {
    try {
      setIsRefreshingIntegrationConnection(true);
      const apiResponse = await refreshIntegrationConnection(userJWTCookie);
      if (apiResponse) {
        // apiResponse.hasTemplateConnectedToIntegration

      }
    } catch (error) {

    } finally {
      setIsRefreshingIntegrationConnection(false);
    }
  }

  return (
    <div className="box__backdrop">
      <div className='howtoconnectbox__container'>
        <button className='howtoconnectbox__cancelbutton' onClick={closeBox}>
          <CloseRoundedIcon fontSize='medium' />
        </button>
        <h2>Example</h2>
        <button className='howtoconnectbox__refreshbutton' onClick={refreshIntegrationCon}>
          Refresh
        </button>
      </div>
    </div>
  );
}

export default HowToConnectToIntegrationBox;