import '../../css/CreateGraphBox.css';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useState } from 'react';

export default function CreateCustomGraphStep2({ graphConfiguration, onUpdateGraphConfig, gotoBack, gotoNext, gotoEnd }) {

  // Date picker
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const onDatePickerChange = (dates) => {
    const [start, end] = dates;
    const startFormatted = (start !== null) ? start.toISOString().split('T')[0] : null;
    const endFormatted = (end !== null) ? end.toISOString().split('T')[0] : null;
    setStartDate(start);
    setEndDate(end);
    handleSelectedCustomDates(startFormatted, endFormatted)
  };

  const onNextButton = () => {
    if (graphConfiguration.graphType === 'SAVINGS') {
      gotoEnd()
    } else {
      gotoNext()
    }
  }

  const handleSelectedDataSource = (dataSource) => {
    onUpdateGraphConfig({
      customGraphSettings: {
        ...graphConfiguration.customGraphSettings,
        dataSettings: {
          ...graphConfiguration.customGraphSettings.dataSettings,
          source: dataSource
        }
      }
    });
  }

  const handleSelectedTime = (time) => {
    onUpdateGraphConfig({
      customGraphSettings: {
        ...graphConfiguration.customGraphSettings,
        dataSettings: {
          ...graphConfiguration.customGraphSettings.dataSettings,
          time: time
        }
      }
    });
  }

  const handleSelectedCustomDates = (startDate, endDate) => {
    onUpdateGraphConfig({
      customGraphSettings: {
        ...graphConfiguration.customGraphSettings,
        dataSettings: {
          ...graphConfiguration.customGraphSettings.dataSettings,
          customStartDate: startDate,
          customEndDate: endDate
        }
      }
    });
  }

  const renderDataButtons = () => {
    return (
      <div className='creategraphbox__step__bigbuttons'>
        <button
          className={graphConfiguration.customGraphSettings.dataSettings.source === 'EXPENSES' ? 'selected' : 'not_selected'}
          onClick={() => handleSelectedDataSource('EXPENSES')}
        >
          <TrendingDownRoundedIcon fontSize='large' />
          <p>Expenses</p>
        </button>
        <button
          className={graphConfiguration.customGraphSettings.dataSettings.source === 'INCOMES' ? 'selected' : 'not_selected'}
          onClick={() => handleSelectedDataSource('INCOMES')}
        >
          <AttachMoneyRoundedIcon fontSize='large' />
          <p>Incomes</p>
        </button>
        <button
          className={graphConfiguration.customGraphSettings.dataSettings.source === 'SAVINGS' ? 'selected' : 'not_selected'}
          onClick={() => handleSelectedDataSource('SAVINGS')}
        >
          <TrendingUpRoundedIcon fontSize='large' />
          <p>Savings</p>
        </button>
      </div>
    );
  }

  const renderTimeButtons = () => {
    return (
      <div className='creategraphbox__step__bigbuttons'>
        <button
          className={`${graphConfiguration.customGraphSettings.dataSettings.time === 'LAST_WEEK' ? 'selected' : 'not_selected'} small`}
          onClick={() => handleSelectedTime('LAST_WEEK')}
        >
          <p>Last week</p>
        </button>
        <button
          className={`${graphConfiguration.customGraphSettings.dataSettings.time === 'LAST_MONTH' ? 'selected' : 'not_selected'} small`}
          onClick={() => handleSelectedTime('LAST_MONTH')}
        >
          <p>Last month</p>
        </button>
        <button
          className={`${graphConfiguration.customGraphSettings.dataSettings.time === 'LAST_YEAR' ? 'selected' : 'not_selected'} small`}
          onClick={() => handleSelectedTime('LAST_YEAR')}
        >
          <p>Last year</p>
        </button>
        <button
          className={`${graphConfiguration.customGraphSettings.dataSettings.time === 'CUSTOM' ? 'selected' : 'not_selected'} small`}
          onClick={() => handleSelectedTime('CUSTOM')}
        >
          <p>Custom time</p>
        </button>
      </div>
    );
  }

  const renderDatePicker = () => {
    return (
      <div className='customdatepicker'>
        <DatePicker
          selected={startDate}
          onChange={onDatePickerChange}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          inline
        />
      </div>
    );
  }

  return (
    <div className='creategraphbox__stepcontainer'>
      <div className='creategraphbox__stepcontent'>
        <div className='creategraphbox__stepgraycontainer'>
          <h2>Data</h2>
          <p>What aspect of your finances would you like to see?</p>
          {renderDataButtons()}
        </div>
        <div className='creategraphbox__stepgraycontainer'>
          <h2>Time</h2>
          <p>Since when you want to see your data?</p>
          {renderTimeButtons()}
          {graphConfiguration.customGraphSettings.dataSettings.time === 'CUSTOM' && renderDatePicker()}
        </div>
      </div>
      <div className='creategraphbox__arrows'>
        <button className='creategraphbox__button back' onClick={gotoBack} disabled={false}>
          Back
        </button>
        <button className='creategraphbox__button next' onClick={onNextButton} disabled={false}>
          Next
        </button>
      </div>
    </div>
  );
}