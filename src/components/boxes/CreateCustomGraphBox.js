import { useState } from 'react';
import { actionTypes } from '../../context/globalReducer';
import { useGlobalStateValue } from '../../context/GlobalStateProvider';
import '../../css/CreateGraphBox.css';
import { getExpensesCategories, getIncomesBankaccounts, getIncomesSources } from '../../RequestUtils';


export default function CreateCustomGraphBox({ graphConfiguration }) {

  // Context
  const [{ userJWTCookie }, dispatch] = useGlobalStateValue();

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

  return (
    <div className='box__backdrop' onClick={closeBox}>
      <div className='creategraphbox__container' onClick={e => { e.stopPropagation(); }}>
        <button className='creategraphbox__cancelbutton' onClick={closeBox}>
          <CloseRoundedIcon fontSize='medium' />
        </button>
        <h1>New Graph</h1>
        {step == 1 && <CreateGraphStep1 graphConfiguration={createGraphConfiguration} onUpdateGraphConfig={handleUpdateGraphConfiguration} gotoNext={handleNextStep} gotoEnd={handleOnEndStep} />}
        {step == 2 && <CreateGraphStep2 graphConfiguration={createGraphConfiguration} onUpdateGraphConfig={handleUpdateGraphConfiguration} gotoBack={handlePrevStep} gotoNext={handleNextStep} expensesCategoriesLoading={expensesCategoriesLoading} incomesBankAccountsLoading={incomesBankAccountsLoading} incomesSourcesLoading={incomesSourcesLoading} />}
      </div>
    </div >
  );
}