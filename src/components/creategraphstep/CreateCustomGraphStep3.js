import '../../css/CreateGraphBox.css';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded';
import { customStyleForSelectPlacement } from '../../utils/Utils';
import SyncLoader from "react-spinners/SyncLoader";
import Select from 'react-select';
import { useState } from 'react';

export default function CreateCustomGraphStep3({ graphConfiguration, onUpdateGraphConfig, gotoBack, gotoNext, expensesCategoriesLoading, incomesBankAccountsLoading, incomesSourcesLoading, expensesCategories, incomesBankAccounts, incomesSources }) {

  const getSelectOptionsFromDatabase = (database) => {
    return database.map(element => {
      return { value: element, label: element };
    });
  }

  const [selectedIncludedCategories, setSelectedIncludedCategories] = useState(getSelectOptionsFromDatabase(graphConfiguration.customGraphSettings.filterSettings.includedCategories));
  const [selectedIncludedIncomeBankAccounts, setSelectedIncludedIncomeBankAccounts] = useState(getSelectOptionsFromDatabase(graphConfiguration.customGraphSettings.filterSettings.includedIncomeBankAccounts));
  const [selectedIncludedIncomeSources, setSelectedIncludedIncomeSources] = useState(getSelectOptionsFromDatabase(graphConfiguration.customGraphSettings.filterSettings.includedIncomeSources));

  const handleSelectedAllExpenses = () => {
    setSelectedIncludedCategories([])
    onUpdateGraphConfig({
      customGraphSettings: {
        ...graphConfiguration.customGraphSettings,
        filterSettings: {
          ...graphConfiguration.customGraphSettings.filterSettings,
          allExpenses: true,
          includedCategories: []
        }
      }
    });
  }

  const handleSelectedAllIncomes = () => {
    setSelectedIncludedIncomeBankAccounts([])
    setSelectedIncludedIncomeSources([])
    onUpdateGraphConfig({
      customGraphSettings: {
        ...graphConfiguration.customGraphSettings,
        filterSettings: {
          ...graphConfiguration.customGraphSettings.filterSettings,
          allIncomes: true,
          includedIncomeBankAccounts: [],
          includedIncomeSources: []
        }
      }
    });
  }

  const handleSelectedIncludedCategories = (includedCategories) => {
    if (includedCategories.length === 0) {
      handleSelectedAllExpenses()
    } else {
      onUpdateGraphConfig({
        customGraphSettings: {
          ...graphConfiguration.customGraphSettings,
          filterSettings: {
            ...graphConfiguration.customGraphSettings.filterSettings,
            allExpenses: false,
            includedCategories: includedCategories
          }
        }
      });
    }
  }

  const handleSelectedIncludedIncomeBankAccounts = (includedIncomeBankAccounts) => {
    if (includedIncomeBankAccounts.length === 0 && selectedIncludedIncomeSources.length === 0) {
      handleSelectedAllIncomes()
    } else {
      onUpdateGraphConfig({
        customGraphSettings: {
          ...graphConfiguration.customGraphSettings,
          filterSettings: {
            ...graphConfiguration.customGraphSettings.filterSettings,
            allIncomes: false,
            includedIncomeBankAccounts: includedIncomeBankAccounts
          }
        }
      });
    }
  }

  const handleSelectedIncludedIncomeSources = (includedIncomeSources) => {
    if (includedIncomeSources.length === 0 && selectedIncludedIncomeBankAccounts.length === 0) {
      handleSelectedAllIncomes()
    } else {
      onUpdateGraphConfig({
        customGraphSettings: {
          ...graphConfiguration.customGraphSettings,
          filterSettings: {
            ...graphConfiguration.customGraphSettings.filterSettings,
            allIncomes: false,
            includedIncomeSources: includedIncomeSources
          }
        }
      });
    }
  }

  const stopPropagation = (event) => {
    event.stopPropagation();
  };

  const renderStep3Heading = () => {
    // For step3, it can only be type = "EXPENSES" or type = "INCOMES"
    if (graphConfiguration.customGraphSettings.dataSettings.source === "EXPENSES") {
      return (
        <div className='creategraphbox__heading'>
          <h2>Expenses</h2>
          <TrendingDownRoundedIcon fontSize='medium' />
        </div>
      );
    } else {
      return (
        <div className='creategraphbox__heading'>
          <h2>Incomes</h2>
          <AttachMoneyRoundedIcon fontSize='medium' />
        </div>
      );
    }
  }

  const renderStep3Content = () => {
    if (graphConfiguration.customGraphSettings.dataSettings.source === "EXPENSES") {
      return (
        <>
          <p>Select all your expenses or filter them</p>
          {renderExpensesButtons()}
        </>
      );
    } else {
      return (
        <>
          <p>Select all your incomes or filter them</p>
          {renderIncomesButtons()}
        </>
      );
    }
  }

  const renderExpensesButtons = () => {
    return (
      <div className='creategraphbox__step__bigbuttons'>
        <button
          className={graphConfiguration.customGraphSettings.filterSettings.allExpenses === true ? 'selected' : 'not_selected'}
          onClick={handleSelectedAllExpenses}
        >
          <p>All expenses</p>
        </button>
        {renderFilterByCategoryButton()}
      </div>
    );
  }

  const renderFilterByCategoryButton = () => {
    if (expensesCategoriesLoading) {
      return (
        <div className='filterbycategory__bigbutton not_selected'>
          <p>Filter by category</p>
          <SyncLoader size={10} color='#909090' />
        </div>
      );
    } else {
      return (
        <div className={`filterbycategory__bigbutton ${graphConfiguration.customGraphSettings.filterSettings.allExpenses === false ? 'selected' : 'not_selected'}`}>
          <p>Filter by category</p>
          <div className='filterbycategory__selectcontainer' onClick={stopPropagation}>
            <Select
              className='selectmultipledatabases'
              theme={(theme) => ({
                ...theme,
                borderRadius: 5,
                colors: {
                  ...theme.colors,
                  primary25: 'lightgray',
                  primary50: 'gray',
                  primary: 'black'
                }
              })}
              isMulti
              closeMenuOnSelect={false}
              options={getSelectOptionsFromDatabase(expensesCategories)}
              menuPlacement="auto" // Adjust placement to avoid overflow
              menuPosition="fixed" // Use fixed positioning to handle overflow better
              styles={customStyleForSelectPlacement}
              menuPortalTarget={document.body}
              value={selectedIncludedCategories}
              onChange={function (selectedCategories) {
                setSelectedIncludedCategories(selectedCategories);
                const selectedValues = selectedCategories.map(category => category.value);
                handleSelectedIncludedCategories(selectedValues);
              }}
            />
          </div>
        </div>
      );
    }
  }

  const renderFilterByIncomeBankAccountsButton = () => {
    if (incomesBankAccountsLoading) {
      return (
        <div className='filterbycategory__bigbutton not_selected'>
          <p>Filter by bank account</p>
          <SyncLoader size={10} color='#909090' />
        </div>
      );
    } else {
      return (
        <div className={`filterbycategory__bigbutton ${graphConfiguration.customGraphSettings.filterSettings.includedIncomeBankAccounts.length === 0 ? 'not_selected' : 'selected'}`}>
          <p>Filter by bank account</p>
          <div className='filterbycategory__selectcontainer' onClick={stopPropagation}>
            <Select
              className='selectmultipledatabases'
              theme={(theme) => ({
                ...theme,
                borderRadius: 5,
                colors: {
                  ...theme.colors,
                  primary25: 'lightgray',
                  primary50: 'gray',
                  primary: 'black'
                }
              })}
              isMulti
              closeMenuOnSelect={false}
              options={getSelectOptionsFromDatabase(incomesBankAccounts)}
              menuPlacement="auto" // Adjust placement to avoid overflow
              menuPosition="fixed" // Use fixed positioning to handle overflow better
              styles={customStyleForSelectPlacement}
              menuPortalTarget={document.body}
              value={selectedIncludedIncomeBankAccounts}
              onChange={function (selectedIncomeBankAccounts) {
                setSelectedIncludedIncomeBankAccounts(selectedIncomeBankAccounts);
                const selectedValues = selectedIncomeBankAccounts.map(category => category.value);
                handleSelectedIncludedIncomeBankAccounts(selectedValues);
              }}
            />
          </div>
        </div>
      );
    }
  }

  const renderFilterByIncomeSourcesButton = () => {
    if (incomesSourcesLoading) {
      return (
        <div className='filterbycategory__bigbutton not_selected'>
          <p>Filter by income source</p>
          <SyncLoader size={10} color='#909090' />
        </div>
      );
    } else {
      return (
        <div className={`filterbycategory__bigbutton ${graphConfiguration.customGraphSettings.filterSettings.includedIncomeSources.length === 0 ? 'not_selected' : 'selected'}`}>
          <p>Filter by income source</p>
          <div className='filterbycategory__selectcontainer' onClick={stopPropagation}>
            <Select
              className='selectmultipledatabases'
              theme={(theme) => ({
                ...theme,
                borderRadius: 5,
                colors: {
                  ...theme.colors,
                  primary25: 'lightgray',
                  primary50: 'gray',
                  primary: 'black'
                }
              })}
              isMulti
              closeMenuOnSelect={false}
              options={getSelectOptionsFromDatabase(incomesSources)}
              menuPlacement="auto" // Adjust placement to avoid overflow
              menuPosition="fixed" // Use fixed positioning to handle overflow better
              styles={customStyleForSelectPlacement}
              menuPortalTarget={document.body}
              value={selectedIncludedIncomeSources}
              onChange={function (selectedIncomeSources) {
                setSelectedIncludedIncomeSources(selectedIncomeSources);
                const selectedValues = selectedIncomeSources.map(category => category.value);
                handleSelectedIncludedIncomeSources(selectedValues);
              }}
            />
          </div>
        </div>
      );
    }
  }

  const renderIncomesButtons = () => {
    return (
      <div className='creategraphbox__step__bigbuttons'>
        <button
          className={graphConfiguration.customGraphSettings.filterSettings.allIncomes === true ? 'selected' : 'not_selected'}
          onClick={() => handleSelectedAllIncomes()}
        >
          <p>All incomes</p>
        </button>
        {renderFilterByIncomeBankAccountsButton()}
        {renderFilterByIncomeSourcesButton()}
      </div>
    );
  }

  return (
    <div className='creategraphbox__stepcontainer'>
      <div className='creategraphbox__stepcontent'>
        <div className='creategraphbox__stepgraycontainer'>
          {renderStep3Heading()}
          {renderStep3Content()}
        </div>
      </div>
      <div className='creategraphbox__arrows'>
        <button className='creategraphbox__button back' onClick={gotoBack} disabled={false}>
          Back
        </button>
        <button className='creategraphbox__button next' onClick={gotoNext} disabled={expensesCategoriesLoading || incomesBankAccountsLoading || incomesSourcesLoading}>
          Next
        </button>
      </div>
    </div>
  );
}