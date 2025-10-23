import { useEffect, useState } from 'react';
import BoxManager from '../components/boxes/BoxManager';
import CreateGraphButton from '../components/CreateGraphButton';
import DashboardGraphs from '../components/DashboardGraphs';
import UserCicleButton from '../components/UserCircleButton';
import '../css/DashboardPage.css';
import { checkIntegrationConnection } from '../api/RequestUtils';
import { useGlobalStateValue } from '../context/GlobalStateProvider';
import { actionTypes } from '../context/globalReducer';

function DashboardPage() {

  // Context
  const [{ userJWTCookie, hasTemplateConnectedToIntegration }, dispatch] = useGlobalStateValue();

  useEffect(() => {
    fetchIntegrationConnection();
  }, []);

  const showHowToConnectToIntegrationBox = () => {
    dispatch({
      type: actionTypes.SET_SHOW_HOW_TO_CONNECT_TO_INTEGRATION_BOX,
      value: true
    })
  }

  const fetchIntegrationConnection = async () => {
    try {
      const apiResponse = await checkIntegrationConnection(userJWTCookie);
      if (apiResponse) {
        dispatch({
          type: actionTypes.SET_HAS_TEMPLATE_CONNECTED_TO_INTEGRATION,
          value: apiResponse.hasTemplateConnectedToIntegration
        })
      }
    } catch (error) {

    } finally {

    }
  }

  const renderNotConnectedToIntegrationWarning = () => {
    return (
      <button className='dashboard__integrationwarningcontainer' onClick={showHowToConnectToIntegrationBox}>
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
          No databases connected to your account. Newly connected databases might take 1-2 minutes to reflect in your account.
        </p>
      </button>
    );
  }

  return (
    <div className="dashboard__page">
      <BoxManager />
      <div className="dashboard__header">
        <CreateGraphButton />
        <UserCicleButton />
      </div>
      <div className='dashboard__body'>
        {!hasTemplateConnectedToIntegration && renderNotConnectedToIntegrationWarning()}
        <DashboardGraphs />
      </div>
    </div>
  );
}

export default DashboardPage;