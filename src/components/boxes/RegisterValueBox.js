import '../../css/RegisterValueBox.css';
import { useState, useEffect } from 'react';
import { actionTypes } from "../../context/globalReducer";
import { useGlobalStateValue } from "../../context/GlobalStateProvider";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import ClipLoader from 'react-spinners/ClipLoader';
import SyncLoader from "react-spinners/SyncLoader";
import { registerValueSelectStyle } from '../../utils/Utils';
import { getExpensesCategories, getIncomesBankaccounts, getIncomesSources, registerValue } from '../../api/RequestUtils';

export default function RegisterValueBox({ valueType }) {

  // Context
  const [{ userJWTCookie }, dispatch] = useGlobalStateValue();

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(null);
  const [incomeBankAccount, setIncomeBankAccount] = useState(null);
  const [incomeSource, setIncomeSource] = useState(null);
  const [amount, setAmount] = useState('');
  const [useCustomDate, setUseCustomDate] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Categories/sources state
  const [categories, setCategories] = useState([]);
  const [incomesBankAccounts, setIncomesBankAccounts] = useState([]);
  const [incomesSources, setIncomesSources] = useState([]);

  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [incomesBankAccountsLoading, setIncomesBankAccountsLoading] = useState(false);
  const [incomesSourcesLoading, setIncomesSourcesLoading] = useState(false);

  // Submit state
  const [isRegistering, setIsRegistering] = useState(false);

  const isExpense = valueType === 'expense';

  useEffect(() => {
    if (isExpense) {
      fetchExpenseCategories();
    } else {
      fetchIncomeCategories();
    }
  }, []);

  const fetchExpenseCategories = async () => {
    try {
      setCategoriesLoading(true);
      const apiResponse = await getExpensesCategories(userJWTCookie);
      if (apiResponse) {
        setCategories(apiResponse);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setCategoriesLoading(false);
    }
  }

  const fetchIncomeCategories = async () => {
    fetchIncomesBankAccounts();
    fetchIncomesSources();
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

  const getSelectOptionsFromDatabase = (database) => {
    return database.map(element => {
      return { value: element, label: element };
    });
  }

  const closeBox = () => {
    dispatch({
      type: actionTypes.CLOSE_ACTIVE_BOX
    })
  }

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  }

  const handleCategoryChange = (selectedOption) => {
    setCategory(selectedOption);
  }

  const handleBankAccountChange = (selectedOption) => {
    setIncomeBankAccount(selectedOption);
  }

  const handleIncomeSourceChange = (selectedOption) => {
    setIncomeSource(selectedOption);
  }

  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Allow negative numbers and decimals
    if (value === '' || /^-?\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  }

  const handleDateToggle = (usesCustom) => {
    setUseCustomDate(usesCustom);
    if (!usesCustom) {
      setSelectedDate(new Date());
    }
  }

  const handleDateChange = (date) => {
    setSelectedDate(date);
  }

  const isFormValid = () => {
    const parsedAmount = parseFloat(amount);
    const isValidAmount = amount !== '' && !isNaN(parsedAmount);
    if (isExpense) {
      return title.trim() !== '' && category !== null && isValidAmount;
    } else {
      return title.trim() !== '' && incomeBankAccount !== null && incomeSource !== null && isValidAmount;
    }
  }

  const handleSubmit = async () => {
    if (!isFormValid()) return;

    try {
      setIsRegistering(true);

      const request = {
        valueType: isExpense ? 'EXPENSE' : 'INCOME',
        title: title.trim(),
        category: category?.value ?? null,
        incomeBankAccount: incomeBankAccount?.value ?? null,
        incomeSource: incomeSource?.value ?? null,
        amount: parseFloat(amount),
        date: selectedDate.toISOString().split('T')[0]
      };

      await registerValue(userJWTCookie, request);
      closeBox();
    } catch (error) {
      console.log(error);
    } finally {
      setIsRegistering(false);
    }
  }

  const getBoxTitle = () => {
    return isExpense ? 'Register Expense' : 'Register Income';
  }

  const renderSelectors = () => {
    if (isExpense) {
      return (
        <div className='registervaluebox__inputgroup'>
          <label>Category</label>
          <div className='registervaluebox__selectcontainer'>
            {categoriesLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '12px' }}>
                <SyncLoader size={8} color='#909090' />
              </div>
            ) : (
              <Select
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 8,
                  colors: {
                    ...theme.colors,
                    primary25: 'lightgray',
                    primary50: 'gray',
                    primary: 'black'
                  }
                })}
                options={getSelectOptionsFromDatabase(categories)}
                menuPlacement="auto"
                menuPosition="fixed"
                styles={registerValueSelectStyle}
                menuPortalTarget={document.body}
                value={category}
                onChange={handleCategoryChange}
                placeholder='Select a category...'
                isClearable
              />
            )}
          </div>
        </div>
      );
    } else {
      return (
        <>
          <div className='registervaluebox__inputgroup'>
            <label>Bank Account</label>
            <div className='registervaluebox__selectcontainer'>
              {incomesBankAccountsLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '12px' }}>
                  <SyncLoader size={8} color='#909090' />
                </div>
              ) : (
                <Select
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 8,
                    colors: {
                      ...theme.colors,
                      primary25: 'lightgray',
                      primary50: 'gray',
                      primary: 'black'
                    }
                  })}
                  options={getSelectOptionsFromDatabase(incomesBankAccounts)}
                  menuPlacement="auto"
                  menuPosition="fixed"
                  styles={registerValueSelectStyle}
                  menuPortalTarget={document.body}
                  value={incomeBankAccount}
                  onChange={handleBankAccountChange}
                  placeholder='Select a bank account...'
                  isClearable
                />
              )}
            </div>
          </div>
          <div className='registervaluebox__inputgroup'>
            <label>Income Source</label>
            <div className='registervaluebox__selectcontainer'>
              {incomesSourcesLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '12px' }}>
                  <SyncLoader size={8} color='#909090' />
                </div>
              ) : (
                <Select
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 8,
                    colors: {
                      ...theme.colors,
                      primary25: 'lightgray',
                      primary50: 'gray',
                      primary: 'black'
                    }
                  })}
                  options={getSelectOptionsFromDatabase(incomesSources)}
                  menuPlacement="auto"
                  menuPosition="fixed"
                  styles={registerValueSelectStyle}
                  menuPortalTarget={document.body}
                  value={incomeSource}
                  onChange={handleIncomeSourceChange}
                  placeholder='Select an income source...'
                  isClearable
                />
              )}
            </div>
          </div>
        </>
      );
    }
  }

  return (
    <div className='box__backdrop' onClick={closeBox}>
      <div className='registervaluebox__container' onClick={e => { e.stopPropagation(); }}>
        <button className='registervaluebox__cancelbutton' onClick={closeBox}>
          <CloseRoundedIcon fontSize='medium' />
        </button>
        <h1>{getBoxTitle()}</h1>

        <div className='registervaluebox__content'>
          <div className='registervaluebox__form'>
            {/* Title Input */}
            <div className='registervaluebox__inputgroup'>
              <label>Title</label>
              <input
                type="text"
                placeholder="Enter a title..."
                value={title}
                onChange={handleTitleChange}
              />
            </div>

            {/* Selector dropdowns - Category or bank account / income source */}
            {renderSelectors()}

            {/* Amount Input */}
            <div className='registervaluebox__inputgroup'>
              <label>Amount</label>
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={handleAmountChange}
                step="0.01"
              />
            </div>

            {/* Date Picker */}
            <div className='registervaluebox__dategroup'>
              <label>
                Date
              </label>
              <div className='registervaluebox__datetoggle'>
                <button
                  className={!useCustomDate ? 'selected' : ''}
                  onClick={() => handleDateToggle(false)}
                >
                  Today
                </button>
                <button
                  className={useCustomDate ? 'selected' : ''}
                  onClick={() => handleDateToggle(true)}
                >
                  Custom date
                </button>
              </div>
              {useCustomDate && (
                <div className='registervaluebox__datepicker'>
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    maxDate={new Date()}
                    inline
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className='registervaluebox__actions'>
              <button
                className='registervaluebox__button cancel'
                onClick={closeBox}
              >
                Cancel
              </button>
              <button
                className='registervaluebox__button submit'
                onClick={handleSubmit}
                disabled={!isFormValid() || isRegistering}
              >
                {isRegistering ? (
                  <ClipLoader size={18} color='#28282B' />
                ) : (
                  'Register'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
