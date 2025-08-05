import '../../css/CreateGraphBox.css';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded';
import { customStyleForSelectPlacement } from '../../Utils';
import SyncLoader from "react-spinners/SyncLoader";
import Select from 'react-select';

export default function CreateCustomGraphStep3({ graphConfiguration, onUpdateGraphConfig, gotoBack, gotoNext, expensesCategoriesLoading, incomesBankAccountsLoading, incomesSourcesLoading, expensesCategories, incomesBankAccounts, incomesSources }) {

  const handleSelectedAllExpenses = () => {
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

  const getSelectOptionsFromDatabase = (database) => {
    return database.map(element => {
      return { value: element, label: element };
    });
  }

  const handleSelectedIncludedCategories = (includedCategories) => {
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

  const stopPropagation = (event) => {
    event.stopPropagation();
  };

  const renderStep3Heading = () => {
    // TODO: think about if SAVINGS can go to this screen
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
          <p>Sample text for expenses</p>
          {renderExpensesButtons()}
        </>
      );
    } else {
      return (
        <>
          <p>Sample text for incomes</p>
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
          onClick={() => handleSelectedAllExpenses()}
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
        <button
          className='not_selected'
          disabled={true}
        >
          <p>Filter by category</p>
          <SyncLoader size={10} color='#909090' />
        </button>
      );
    } else {
      return (
        <button
          className={graphConfiguration.customGraphSettings.filterSettings.allExpenses === false ? 'selected' : 'not_selected'}
          onClick={() => handleSelectedIncludedCategories('test')}
        >
          <p>Filter by category</p>
          <div className='creategraphbox__filterbycategory__container' onClick={stopPropagation}>
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
              options={getSelectOptionsFromDatabase(expensesCategories)}
              menuPlacement="auto" // Adjust placement to avoid overflow
              menuPosition="fixed" // Use fixed positioning to handle overflow better
              styles={customStyleForSelectPlacement}
              menuPortalTarget={document.body}
              onChange={function (selectedCategory) {
                handleSelectedIncludedCategories(selectedCategory.value)
              }}
            />
          </div>
        </button>
      );
    }
  }

  const renderIncomesButtons = () => {
    return (
      <div>

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