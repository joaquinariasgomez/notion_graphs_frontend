import { useEffect, useState } from 'react';
import BoxManager from '../components/boxes/BoxManager';
import CreateGraphButton from '../components/CreateGraphButton';
import DashboardGraphs from '../components/DashboardGraphs';
import UserCicleButton from '../components/UserCircleButton';
import '../css/DashboardPage.css';
import { checkIntegrationConnection, getBillingGraphCount, getBillingPlan } from '../api/RequestUtils';
import { useGlobalStateValue } from '../context/GlobalStateProvider';
import { actionTypes, BOX_TYPES } from '../context/globalReducer';
import GetPlusButton from '../components/GetPlusButton';
import RegisterValueButtons from '../components/RegisterValueButtons';

function DashboardPage() {

  // Context
  const [{ userJWTCookie, templateConnectedToIntegrationData, billingGraphCountData, billingPlan }, dispatch] = useGlobalStateValue();

  const [integrationConnectionLoading, setIntegrationConnectionLoading] = useState(true);

  useEffect(() => {
    fetchIntegrationConnection();
    fetchBillingGraphCount();
    fetchBillingPlan();
  }, []);

  // TODO JOAQUIN: show a warning if your billing resources are getting full

  const fetchIntegrationConnection = async () => {
    try {
      setIntegrationConnectionLoading(true);
      const apiResponse = await checkIntegrationConnection(userJWTCookie);
      if (apiResponse) {
        dispatch({
          type: actionTypes.SET_TEMPLATE_CONNECTED_TO_INTEGRATION_DATA,
          value: apiResponse
        })
      }
    } catch (error) {

    } finally {
      setIntegrationConnectionLoading(false);
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
      type: actionTypes.SET_ACTIVE_BOX,
      value: {
        type: BOX_TYPES.PROFILE,
        data: { panel: 'walletconnection' }
      }
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
        <GetPlusButton billingPlan={billingPlan} />
        <UserCicleButton />
      </div>
      <div className='dashboard__body'>
        {!integrationConnectionLoading && !templateConnectedToIntegrationData?.hasTemplateConnectedToIntegration && renderNotConnectedToIntegrationWarning()}
        {!integrationConnectionLoading && templateConnectedToIntegrationData.hasTemplateConnectedToIntegration && <RegisterValueButtons />}
        <DashboardGraphs />
      </div>
    </div>
  );
}

export default DashboardPage;