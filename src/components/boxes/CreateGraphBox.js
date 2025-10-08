import '../../css/CreateGraphBox.css';
import { useEffect, useState } from 'react';
import { useGlobalStateValue } from '../../context/GlobalStateProvider';
import { actionTypes } from '../../context/globalReducer';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CreateSpendingBurndown from '../creategraphstep/CreateSpendingBurndown';
import CreateCustomGraphStep2 from '../creategraphstep/CreateCustomGraphStep2';
import CreateCustomGraphStep3 from '../creategraphstep/CreateCustomGraphStep3';
import { getExpensesCategories, getIncomesBankaccounts, getIncomesSources } from '../../api/RequestUtils';
import CreateCustomGraphStep4 from '../creategraphstep/CreateCustomGraphStep4';

export default function CreateGraphBox() {

  // Context
  const [{ userJWTCookie }, dispatch] = useGlobalStateValue();

  const [expensesCategories, setExpensesCategories] = useState([]);
  const [incomesBankAccounts, setIncomesBankAccounts] = useState([]);
  const [incomesSources, setIncomesSources] = useState([]);

  const [expensesCategoriesLoading, setExpensesCategoriesLoading] = useState(false);
  const [incomesBankAccountsLoading, setIncomesBankAccountsLoading] = useState(false);
  const [incomesSourcesLoading, setIncomesSourcesLoading] = useState(false);

  // States to manage form data
  const [step, setStep] = useState(1);

  const [graphConfiguration, setGraphConfiguration] = useState({
    customTitle: null,
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
      referenceSettings: {
        type: 'TOTAL_AVERAGE', // 'TOTAL_AVERAGE', 'LAST_YEAR_AVERAGE', 'BEST_MONTH', 'CUSTOM'
        customMonth: ''
      },
      filterSettings: {
        allExpenses: true,
        includedCategories: []
      },
      dataSettings: {
        time: 'LAST_MONTH', // 'LAST_MONTH', 'CUSTOM'
        customMonth: ''
      }
    }
  });

  useEffect(() => {
    console.log("Joaquin: ", graphConfiguration);
  }, [graphConfiguration]);

  useEffect(() => {
    fetchExpensesCategories();
    fetchIncomesBankAccounts();
    fetchIncomesSources();
  }, []);

  const fetchExpensesCategories = async () => {
    try {
      setExpensesCategoriesLoading(true);
      const apiResponse = await getExpensesCategories(userJWTCookie);
      if (apiResponse) {
        setExpensesCategories(apiResponse);
      }
    } catch (error) {
      console.log(error); // TODO: remove
    } finally {
      setExpensesCategoriesLoading(false);
    }
  }

  const fetchIncomesBankAccounts = async () => {
    try {
      setIncomesBankAccountsLoading(true);
      const apiResponse = await getIncomesBankaccounts(userJWTCookie);
      if (apiResponse) {
        setIncomesBankAccounts(apiResponse);
      }
    } catch (error) {
      console.log(error); // TODO: remove
    } finally {
      setIncomesBankAccountsLoading(false);
    }
  }

  const fetchIncomesSources = async () => {
    try {
      setIncomesSourcesLoading(true);
      const apiResponse = await getIncomesSources(userJWTCookie);
      if (apiResponse) {
        setIncomesSources(apiResponse);
      }
    } catch (error) {
      console.log(error); // TODO: remove
    } finally {
      setIncomesSourcesLoading(false);
    }
  }

  const handleNextStep = () => {
    setStep(step + 1);
  }

  const handleOnEndStep = () => {
    setStep(4);
  }

  const handleOnBeginStep = () => {
    setStep(2);
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
      return <CreateCustomGraphStep2 graphConfiguration={graphConfiguration} onUpdateGraphConfig={handleUpdateGraphConfiguration} gotoBack={handlePrevStep} gotoNext={handleNextStep} gotoEnd={handleOnEndStep} />;
    } else {
      return <CreateSpendingBurndown graphConfiguration={graphConfiguration} onUpdateGraphConfig={handleUpdateGraphConfiguration} gotoBack={handlePrevStep} expensesCategoriesLoading={expensesCategoriesLoading} expensesCategories={expensesCategories} />;
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
        {step === 3 && <CreateCustomGraphStep3 graphConfiguration={graphConfiguration} onUpdateGraphConfig={handleUpdateGraphConfiguration} gotoBack={handlePrevStep} gotoNext={handleNextStep} expensesCategoriesLoading={expensesCategoriesLoading} incomesBankAccountsLoading={incomesBankAccountsLoading} incomesSourcesLoading={incomesSourcesLoading} expensesCategories={expensesCategories} incomesBankAccounts={incomesBankAccounts} incomesSources={incomesSources} />}
        {step === 4 && <CreateCustomGraphStep4 graphConfiguration={graphConfiguration} onUpdateGraphConfig={handleUpdateGraphConfiguration} gotoBack={handlePrevStep} gotoBegin={handleOnBeginStep} />}
      </div>
    </div >
  );
}