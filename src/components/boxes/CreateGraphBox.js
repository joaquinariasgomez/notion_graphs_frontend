import '../../css/CreateGraphBox.css';
import { useEffect, useState } from 'react';
import { useGlobalStateValue } from '../../context/GlobalStateProvider';
import { getExpensesCategories, getIncomesBankaccounts, getIncomesSources } from '../../RequestUtils';
import { actionTypes } from '../../context/globalReducer';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CreateGraphStep1 from '../creategraphstep/CreateGraphStep1';
import CreateGraphStep2 from '../creategraphstep/CreateGraphStep2';

export default function CreateGraphBox() {

  // Context
  const [{ userSessionDetails, userJWTCookie }, dispatch] = useGlobalStateValue();

  // States to manage form data
  const [step, setStep] = useState(1);
  // TODO: do a refactor of this once it is working in prod
  const [createGraphData, setCreateGraphData] = useState({
    graphType: 'EXPENSES',
    graphTag: 'DAILY',
    filterCategories: {  // 'SUM',    // 'SUM', 'BY CATEGORY', 'BY BANKACCOUNT', 'BY INCOMESOURCE', 'BURNDOWN'
      type: 'SUM',    // 'SUM' for all expenses/incomes/savings
      // 'BY CATEGORY' for groupings by category/bankacount/incomesource
      // 'SPECIFIC CATEGORY' for specific category/bankaccount/incomesource
      // 'BURNDOWN' for a new expenses graph type which shows it as a burndown
      category: 'Select category' // Specify the category for 'SPECIFIC CATEGORY' type
    },
    groupBy: 'DAY',
    time: 'LAST WEEK',
    customStartDate: '',
    customEndDate: '',
    plot: 'Select plot', // This will be a customization for certain graphs
    burndownReference: 'TOTAL', // Will be either:
    // 'TOTAL': calculates the reference using the average of every month registered in the system (using some min date).
    // 'LAST YEAR': calculates the reference using just the last year expenses data.
    // 'BEST MONTH': calculates the reference using just the month where I spent the less amount.
    burndownType: 'SUM', // 'SUM' for all expenses and 'SPECIFIC CATEGORY' for a specific expense category
    burndownCategory: 'Select category', // Specify the category for 'SPECIFIC CATEGORY' type
    burndownTime: 'LAST MONTH', // 'LAST MONTH' or 'CUSTOM MONTH'
    burndownCustomMonth: ''
  });

  const [expensesCategories, setExpensesCategories] = useState([]);
  const [incomesBankAccounts, setIncomesBankAccounts] = useState([]);
  const [incomesSources, setIncomesSources] = useState([]);

  const [expensesCategoriesLoading, setExpensesCategoriesLoading] = useState(false);
  const [incomesBankAccountsLoading, setIncomesBankAccountsLoading] = useState(false);
  const [incomesSourcesLoading, setIncomesSourcesLoading] = useState(false);

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

  const closeBox = () => {
    dispatch({
      type: actionTypes.SET_SHOW_CREATE_GRAPH_BOX,
      value: false
    })
  }

  const handleNextStep = () => {
    setStep(step + 1);
  }

  const handleOnEndStep = () => {
    setStep(step + 2);
  }

  const handleOnBeginStep = () => {
    setStep(step - 2);
  }

  const handlePrevStep = () => {
    setStep(step - 1);
  }

  const handleUpdateGraphConfiguration = (data) => {
    setCreateGraphData({ ...createGraphData, ...data });
  }

  return (
    <div className='box__backdrop' onClick={closeBox}>
      <div className='creategraphbox__container' onClick={e => { e.stopPropagation(); }}>
        <button className='creategraphbox__cancelbutton' onClick={closeBox}>
          <CloseRoundedIcon fontSize='medium' />
        </button>
        <h1>New Graph</h1>
        {step == 1 && <CreateGraphStep1 graphConfiguration={createGraphData} onUpdateGraphConfig={handleUpdateGraphConfiguration} gotoNext={handleNextStep} gotoEnd={handleOnEndStep} />}
        {step == 2 && <CreateGraphStep2 graphConfiguration={createGraphData} onUpdateGraphConfig={handleUpdateGraphConfiguration} gotoBack={handlePrevStep} gotoNext={handleNextStep} expensesCategoriesLoading={expensesCategoriesLoading} incomesBankAccountsLoading={incomesBankAccountsLoading} incomesSourcesLoading={incomesSourcesLoading} />}
      </div>
    </div >
  );
}