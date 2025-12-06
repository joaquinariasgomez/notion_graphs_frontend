import { useNavigate } from 'react-router-dom';
import '../css/CreateGraphButton.css';
import { BillingPlan } from '../utils/BillingPlanEnum';
import { useGlobalStateValue } from '../context/GlobalStateProvider';
import PulseLoader from "react-spinners/PulseLoader";
import { actionTypes, BOX_TYPES } from '../context/globalReducer';

function GetPlusButton({ billingPlan }) {

  // Context
  const [, dispatch] = useGlobalStateValue();

  const navigate = useNavigate();

  const handleOpenNotionBillingPanel = () => {
    dispatch({
      type: actionTypes.SET_ACTIVE_BOX,
      value: {
        type: BOX_TYPES.PROFILE,
        data: { panel: 'billing' }
      }
    })
  }

  const isLoading = () => {
    return billingPlan === null;
  }

  const hasFreePlan = () => {
    return billingPlan === BillingPlan.FREE;
  }

  const renderButtonContent = () => {
    if (isLoading()) {
      return (
        <PulseLoader size={10} style={{ color: '#6d6d6d' }} />
      );
    } else {
      if (hasFreePlan()) {
        return (
          <h2>Get Plus</h2>
        );
      } else {
        return (
          <h2>Plus</h2>
        );
      }
    }
  }

  const handleClickButton = () => {
    if (hasFreePlan()) {
      navigate('/billing-plans');
    } else {
      handleOpenNotionBillingPanel();
    }
  }

  return (
    <button className="getplus__button header__item" onClick={handleClickButton}>
      <div className='getplus__button__container'>
        {renderButtonContent()}
      </div>
    </button>
  );
}

export default GetPlusButton;