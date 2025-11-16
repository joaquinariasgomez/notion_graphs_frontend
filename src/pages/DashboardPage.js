import { useEffect, useState } from 'react';
import BoxManager from '../components/boxes/BoxManager';
import CreateGraphButton from '../components/CreateGraphButton';
import DashboardGraphs from '../components/DashboardGraphs';
import UserCicleButton from '../components/UserCircleButton';
import '../css/DashboardPage.css';
import { checkIntegrationConnection, getBillingGraphCount, getBillingPlan } from '../api/RequestUtils';
import { useGlobalStateValue } from '../context/GlobalStateProvider';
import { actionTypes } from '../context/globalReducer';

function DashboardPage() {

  // Context
  const [{ userJWTCookie, templateConnectedToIntegrationData, billingGraphCountData, billingPlan }, dispatch] = useGlobalStateValue();

  useEffect(() => {
    fetchIntegrationConnection();
    fetchBillingGraphCount();
    fetchBillingPlan();
  }, []);

  // TODO JOAQUIN: maybe show a warning if your billing resources are getting full

  const fetchIntegrationConnection = async () => {
    try {
      const apiResponse = await checkIntegrationConnection(userJWTCookie);
      if (apiResponse) {
        dispatch({
          type: actionTypes.SET_TEMPLATE_CONNECTED_TO_INTEGRATION_DATA,
          value: apiResponse
        })
      }
    } catch (error) {

    } finally {

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

    } finally {

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

    } finally {

    }
  }

  const showNotionConnectionBox = () => {
    dispatch({
      type: actionTypes.SET_SHOW_NOTION_CONNECTION_BOX,
      value: true
    })
  }

  const renderNotConnectedToIntegrationWarning = () => {
    return (
      <button className='dashboard__integrationwarningcontainer' onClick={showNotionConnectionBox}>
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
          No integration connected to your account. Newly connected integrations might take 1-2 minutes to reflect in your account.
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
        {!templateConnectedToIntegrationData?.hasTemplateConnectedToIntegration && renderNotConnectedToIntegrationWarning()}
        <DashboardGraphs />
      </div>
    </div>
  );
}

export default DashboardPage;