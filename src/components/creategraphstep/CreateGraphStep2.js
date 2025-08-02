import '../../css/CreateGraphBox.css';

export default function CreateGraphStep2({ graphConfiguration, onUpdateGraphConfig, gotoBack, gotoNext, expensesCategoriesLoading, incomesBankAccountsLoading, incomesSourcesLoading }) {



  return (
    <div className='creategraphbox__stepcontainer'>
      <div className='creategraphbox__stepcontent'>
        hey
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