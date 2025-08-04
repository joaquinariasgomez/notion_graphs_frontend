import '../../css/CreateGraphBox.css';
import { useEffect, useState } from 'react';
import { useGlobalStateValue } from '../../context/GlobalStateProvider';
import { actionTypes } from '../../context/globalReducer';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CreateSpendingBurndown from '../creategraphstep/CreateSpendingBurndown';
import CreateCustomGraphStep2 from '../creategraphstep/CreateCustomGraphStep2';

export default function CreateGraphBox() {

  // Context
  const [{ }, dispatch] = useGlobalStateValue();

  // States to manage form data
  const [step, setStep] = useState(1);

  const [graphConfiguration, setGraphConfiguration] = useState({
    requestType: '', // 'CUSTOM_GRAPH', 'BURNDOWN', // In the future: 'BUILDUP',
    customGraphSettings: {
      dataSettings: {
        source: 'EXPENSES',   // 'EXPENSES', 'INCOMES', 'SAVINGS'
        time: 'LAST_WEEK',    // 'LAST_WEEK', 'LAST_MONTH', 'LAST_YEAR', 'CUSTOM'
        customStartDate: '',
        customEndDate: ''
      },
      filterSettings: {
        allExpenses: true,              // For source = 'EXPENSES'
        includedCategories: [],         // For source = 'EXPENSES', and taken into consideration when allExpenses = false
        allIncomes: true,               // For source = 'INCOMES'
        includedIncomeBankAccounts: [], // For source = 'INCOMES', and taken into consideration when allIncomes = false. When this is filled, includedIncomeSources is put to []
        includedIncomeSources: [],      // For source = 'INCOMES', and taken into consideration when allIncomes = false. When this is filled, includedIncomeBankAccounts is put to []
      },
      visualizationSettings: {
        type: 'LINE',         // 'LINE', 'BAR', depending on the prev configuration we might want to default to BAR or LINE
        groupByTime: 'DAY',       // 'DAY', 'WEEK', 'MONTH', 'YEAR'
        groupByCategory: false,           // For source = 'EXPENSES'
        groupByIncomeBankAccounts: false, // For source = 'INCOMES'
        groupByIncomeSources: false,      // For source = 'INCOMES'
        cumulative: false
      }
    },
    burndownSettings: {

    }
  });

  // useEffect(() => {
  //   console.log(graphConfiguration.customGraphSettings.dataSettings.customStartDate + "" + graphConfiguration.customGraphSettings.dataSettings.customEndDate);
  // }, [graphConfiguration]);

  const handleNextStep = () => {
    setStep(step + 1);
  }

  const handleOnEndStep = () => {
    setStep(4);
  }

  const handleOnBeginStep = () => {
    setStep(1);
  }

  const handlePrevStep = () => {
    setStep(step - 1);
  }

  const closeBox = () => {
    dispatch({
      type: actionTypes.SET_SHOW_CREATE_GRAPH_BOX,
      value: false
    })
  }

  const handleSelectedRequestType = (requestType) => {
    handleUpdateGraphConfiguration({ requestType: requestType });
    handleNextStep();
  }

  const handleUpdateGraphConfiguration = (data) => {
    setGraphConfiguration({ ...graphConfiguration, ...data });
  }

  const renderCreateGraphStep1Buttons = () => {
    return (
      <div className='creategraphbox__step1__content'>
        <div className='creategraphbox__step__bigbuttons vertical'>
          <button
            className='step1'
            onClick={() => handleSelectedRequestType('CUSTOM_GRAPH')}
          >
            <p>Create a Custom Graph</p>
          </button>
          <button
            className='step1'
            onClick={() => handleSelectedRequestType('BURNDOWN')}
          >
            <p>View Spending Burndown</p>
          </button>
        </div>
      </div>
    );
  }

  const renderNextScreen = () => {
    if (graphConfiguration.requestType === 'CUSTOM_GRAPH') {
      return <CreateCustomGraphStep2 graphConfiguration={graphConfiguration} onUpdateGraphConfig={handleUpdateGraphConfiguration} gotoBack={handlePrevStep} gotoNext={handleNextStep} />;
    } else {
      return <CreateSpendingBurndown graphConfiguration={graphConfiguration} />;
    }
  }

  return (
    <div className='box__backdrop' onClick={closeBox}>
      <div className='creategraphbox__container' onClick={e => { e.stopPropagation(); }}>
        <button className='creategraphbox__cancelbutton' onClick={closeBox}>
          <CloseRoundedIcon fontSize='medium' />
        </button>
        <h1>New Graph</h1>
        {step === 1 && renderCreateGraphStep1Buttons()}
        {step === 2 && renderNextScreen()}
      </div>
    </div >
  );
}