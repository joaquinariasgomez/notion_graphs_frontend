import '../../css/CreateGraphBox.css';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded';

export default function CreateGraphStep1({ graphConfiguration, onUpdateGraphConfig, gotoNext, gotoEnd }) {

  const onNextButton = () => {
    if (graphConfiguration.graphType === 'SAVINGS') {
      gotoEnd()
    } else {
      gotoNext()
    }
  }

  const handleSelectedType = (type) => {
    // Update data in parent, to send all together
    var subtype = graphConfiguration.subtype;
    if (type === "INCOMES" && subtype === "BURNDOWN") {
      subtype = "BUILDUP";
    }
    if (type === "EXPENSES" && subtype === "BUILDUP") {
      subtype = "BURNDOWN";
    }

    if (type === "SAVINGS") {
      onUpdateGraphConfig({ type: type, subtype: subtype, plot: 'Savings' });
    } else {
      onUpdateGraphConfig({ type: type, subtype: subtype, filterCategories: { type: 'SUM', category: 'Select category' } });
    }
  }

  const handleSelectedSubType = (subtype) => {
    onUpdateGraphConfig({ subtype: subtype });
  }

  const renderGraphTypeButtons = () => {
    return (
      <div className='creategraphbox__step__bigbuttons'>
        <button
          className={graphConfiguration.type === 'EXPENSES' ? 'selected' : 'not_selected'}
          onClick={() => handleSelectedType('EXPENSES')}
        >
          <TrendingDownRoundedIcon fontSize='large' />
          <p>Expenses</p>
        </button>
        <button
          className={graphConfiguration.type === 'INCOMES' ? 'selected' : 'not_selected'}
          onClick={() => handleSelectedType('INCOMES')}
        >
          <AttachMoneyRoundedIcon fontSize='large' />
          <p>Incomes</p>
        </button>
        <button
          className={graphConfiguration.type === 'SAVINGS' ? 'selected' : 'not_selected'}
          onClick={() => handleSelectedType('SAVINGS')}
        >
          <TrendingUpRoundedIcon fontSize='large' />
          <p>Savings</p>
        </button>
      </div>
    );
  }

  const renderGraphSubTypeButtons = () => {
    if (graphConfiguration.type === 'EXPENSES') {
      return (
        <div className='creategraphbox__step__bigbuttons'>
          <button
            className={`${graphConfiguration.subtype === 'STANDARD' ? 'selected' : 'not_selected'} small`}
            onClick={() => handleSelectedSubType('STANDARD')}
          >
            <p>Standard</p>
          </button>
          <button
            className={`${graphConfiguration.subtype === 'BURNDOWN' ? 'selected' : 'not_selected'} small`}
            onClick={() => handleSelectedSubType('BURNDOWN')}
          >
            <p>Burndown</p>
          </button>
        </div>
      );
    } else if (graphConfiguration.type === 'INCOMES') {
      return (
        <div className='creategraphbox__step__bigbuttons'>
          <button
            className={`${graphConfiguration.subtype === 'STANDARD' ? 'selected' : 'not_selected'} small`}
            onClick={() => handleSelectedSubType('STANDARD')}
          >
            <p>Standard</p>
          </button>
          <button
            className={`${graphConfiguration.subtype === 'BUILDUP' ? 'selected' : 'not_selected'} small`}
            onClick={() => handleSelectedSubType('BUILDUP')}
          >
            <p>Buildup</p>
          </button>
        </div>
      );
    }
  }

  return (
    <div className='creategraphbox__stepcontainer'>
      <div className='creategraphbox__stepcontent'>
        <div className='creategraphbox__stepgraycontainer'>
          <h2>Type</h2>
          <p>What aspect of your finances would you like to see?</p>
          {renderGraphTypeButtons()}
        </div>
        {graphConfiguration.type !== "SAVINGS" &&
          <div className='creategraphbox__stepgraycontainer'>
            <h2>Sub type</h2>
            <p>What kind of data do you want to see?</p>
            {renderGraphSubTypeButtons()}
          </div>
        }
      </div>
      <div className='creategraphbox__arrows'>
        <button className='creategraphbox__button next' onClick={onNextButton} disabled={false}>
          Next
        </button>
      </div>
    </div>
  );
}