import '../../css/CreateGraphBox.css';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded';

export default function CreateGraphStep2({ graphConfiguration, onUpdateGraphConfig, gotoBack, gotoNext, expensesCategoriesLoading, incomesBankAccountsLoading, incomesSourcesLoading }) {

  const renderStep2Heading = () => {
    // For step2, it can only be type = "EXPENSES" or type = "INCOMES"
    if (graphConfiguration.type === "EXPENSES") {
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

  const renderStep2Buttons = () => {
    if (graphConfiguration.type === "EXPENSES") {
      return renderExpensesButtons();
    } else {
      return renderIncomesButtons();
    }
  }

  const renderExpensesButtons = () => {
    return (
      <div className='creategraphbox__step__bigbutton'>
        <button
          className=''
        >

        </button>
      </div>
    );
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
          {renderStep2Heading()}
          {renderStep2Buttons()}
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