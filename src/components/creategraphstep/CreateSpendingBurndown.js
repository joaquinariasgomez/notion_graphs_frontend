import '../../css/CreateGraphBox.css';
import { customStyleForSelectPlacement } from '../../utils/Utils';
import ClipLoader from 'react-spinners/ClipLoader';
import SyncLoader from "react-spinners/SyncLoader";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns'; // Recommended for easy date formatting
import { useState } from 'react';
import Select from 'react-select';
import { createGraph } from '../../api/RequestUtils';
import { useGlobalStateValue } from '../../context/GlobalStateProvider';
import { actionTypes } from '../../context/globalReducer';

const RESOLUTION_VALUES = ['DAILY', 'WEEKLY', 'MONTHLY'];

const VALID_REFERENCE = {
  MONTHLY: ['TOTAL_AVERAGE', 'LAST_YEAR_AVERAGE', 'BEST_MONTH', 'CUSTOM_MONTH'],
  YEARLY: ['BEST_YEAR', 'CUSTOM_YEAR'],
};
const DEFAULT_REFERENCE = { MONTHLY: 'TOTAL_AVERAGE', YEARLY: 'BEST_YEAR' };
const VALID_TIME = {
  MONTHLY: ['LAST_MONTH', 'CUSTOM_MONTH'],
  YEARLY: ['LAST_YEAR', 'CUSTOM_YEAR'],
};
const DEFAULT_TIME = { MONTHLY: 'LAST_MONTH', YEARLY: 'LAST_YEAR' };

export default function CreateSpendingBurndown({ graphConfiguration, onUpdateGraphConfig, gotoBack, expensesCategoriesLoading, expensesCategories }) {

  const getSelectOptionsFromDatabase = (database) => {
    return database.map(element => {
      return { value: element, label: element };
    });
  }

  // Context
  const [{ userJWTCookie }, dispatch] = useGlobalStateValue();

  const [selectedIncludedCategories, setSelectedIncludedCategories] = useState(getSelectOptionsFromDatabase(graphConfiguration.burndownSettings.filterSettings.includedCategories));

  // Month picker
  const [selectedReferenceMonth, setSelectedReferenceMonth] = useState(new Date());
  const [selectedTimeMonth, setSelectedTimeMonth] = useState(new Date());
  const onReferenceMonthChange = (date) => {
    setSelectedReferenceMonth(date);
    const monthFormatted = format(date, 'yyyy-MM');
    handleSelectedReferenceCustomMonth(monthFormatted);
  }
  const onTimeMonthChange = (date) => {
    setSelectedTimeMonth(date);
    const monthFormatted = format(date, 'yyyy-MM');
    handleSelectedTimeCustomMonth(monthFormatted);
  }

  // Year picker
  const [selectedReferenceYear, setSelectedReferenceYear] = useState(new Date());
  const [selectedTimeYear, setSelectedTimeYear] = useState(new Date());
  const onReferenceYearChange = (date) => {
    setSelectedReferenceYear(date);
    handleSelectedReferenceCustomYear(date.getFullYear());
  }
  const onTimeYearChange = (date) => {
    setSelectedTimeYear(date);
    handleSelectedTimeCustomYear(date.getFullYear());
  }

  const closeCreateGraphBox = () => {
    dispatch({
      type: actionTypes.CLOSE_ACTIVE_BOX
    })
  }

  const createPendingGraphWithConfiguration = (graphConfig) => {
    const updatedConfig = {
      ...graphConfig,
      graphCreationStatus: "PENDING",
      id: crypto.randomUUID(), // Autogenerate a random id just to be able to reorder it while it loads
    };
    return {
      graphConfiguration: updatedConfig,
      graphData: null
    }
  }

  const handleCreateGraph = async () => {
    let pendingGraphConfiguration = null;
    try {
      closeCreateGraphBox();
      pendingGraphConfiguration = createPendingGraphWithConfiguration(graphConfiguration);
      dispatch({
        type: actionTypes.APPEND_GRAPH,
        value: pendingGraphConfiguration
      });
      const apiResponse = await createGraph(userJWTCookie, graphConfiguration);
      // Override pending graph that just got created
      if (apiResponse) {
        dispatch({
          type: actionTypes.UPDATE_GRAPH,
          payload: {
            id: pendingGraphConfiguration.graphConfiguration.id,
            data: apiResponse
          }
        });
      }
    } catch (error) {
      dispatch({
        type: actionTypes.DELETE_GRAPH,
        value: pendingGraphConfiguration.graphConfiguration.id
      });
    } finally { }
  }

  const stopPropagation = (event) => {
    event.stopPropagation();
  };

  const handleSelectedAllExpenses = () => {
    setSelectedIncludedCategories([])
    onUpdateGraphConfig({
      burndownSettings: {
        ...graphConfiguration.burndownSettings,
        filterSettings: {
          ...graphConfiguration.burndownSettings.filterSettings,
          allExpenses: true,
          includedCategories: []
        }
      }
    });
  }

  const handleSelectedReferenceTime = (type) => {
    onUpdateGraphConfig({
      burndownSettings: {
        ...graphConfiguration.burndownSettings,
        referenceSettings: {
          ...graphConfiguration.burndownSettings.referenceSettings,
          type: type
        }
      }
    });
  }

  const handleSelectedTime = (time) => {
    onUpdateGraphConfig({
      burndownSettings: {
        ...graphConfiguration.burndownSettings,
        dataSettings: {
          ...graphConfiguration.burndownSettings.dataSettings,
          time: time
        }
      }
    });
  }

  const handleSelectedReferenceCustomMonth = (customMonth) => {
    onUpdateGraphConfig({
      burndownSettings: {
        ...graphConfiguration.burndownSettings,
        referenceSettings: {
          ...graphConfiguration.burndownSettings.referenceSettings,
          customMonth: customMonth
        }
      }
    });
  }

  const handleSelectedTimeCustomMonth = (customMonth) => {
    onUpdateGraphConfig({
      burndownSettings: {
        ...graphConfiguration.burndownSettings,
        dataSettings: {
          ...graphConfiguration.burndownSettings.dataSettings,
          customMonth: customMonth
        }
      }
    });
  }

  const handleSelectedReferenceCustomYear = (customYear) => {
    onUpdateGraphConfig({
      burndownSettings: {
        ...graphConfiguration.burndownSettings,
        referenceSettings: {
          ...graphConfiguration.burndownSettings.referenceSettings,
          customYear: customYear
        }
      }
    });
  }

  const handleSelectedTimeCustomYear = (customYear) => {
    onUpdateGraphConfig({
      burndownSettings: {
        ...graphConfiguration.burndownSettings,
        dataSettings: {
          ...graphConfiguration.burndownSettings.dataSettings,
          customYear: customYear
        }
      }
    });
  }

  const handleSelectedResolution = (resolution) => {
    const bs = graphConfiguration.burndownSettings;
    onUpdateGraphConfig({
      burndownSettings: {
        ...bs,
        visualizationSettings: {
          ...(bs.visualizationSettings ?? {}),
          resolution
        }
      }
    });
  }

  const handleSelectedStrategy = (type) => {
    const referenceType = VALID_REFERENCE[type].includes(graphConfiguration.burndownSettings.referenceSettings.type)
      ? graphConfiguration.burndownSettings.referenceSettings.type
      : DEFAULT_REFERENCE[type];
    const time = VALID_TIME[type].includes(graphConfiguration.burndownSettings.dataSettings.time)
      ? graphConfiguration.burndownSettings.dataSettings.time
      : DEFAULT_TIME[type];
    onUpdateGraphConfig({
      burndownSettings: {
        ...graphConfiguration.burndownSettings,
        type,
        referenceSettings: { ...graphConfiguration.burndownSettings.referenceSettings, type: referenceType },
        dataSettings: { ...graphConfiguration.burndownSettings.dataSettings, time },
      },
    });
  }

  const renderReferenceMonthPicker = () => {
    return (
      <div className='customdatepicker'>
        <DatePicker
          selected={selectedReferenceMonth}
          onChange={onReferenceMonthChange}
          showMonthYearPicker
          dateFormat="MMMM yyyy" // This format looks better for a month picker
          inline
        />
      </div>
    );
  }

  const renderTimeMonthPicker = () => {
    return (
      <div className='customdatepicker'>
        <DatePicker
          selected={selectedTimeMonth}
          onChange={onTimeMonthChange}
          showMonthYearPicker
          dateFormat="MMMM yyyy" // This format looks better for a month picker
          inline
        />
      </div>
    );
  }

  const renderReferenceYearPicker = () => {
    return (
      <div className='customdatepicker'>
        <DatePicker
          selected={selectedReferenceYear}
          onChange={onReferenceYearChange}
          showYearPicker
          dateFormat="yyyy"
          inline
        />
      </div>
    );
  }

  const renderTimeYearPicker = () => {
    return (
      <div className='customdatepicker'>
        <DatePicker
          selected={selectedTimeYear}
          onChange={onTimeYearChange}
          showYearPicker
          dateFormat="yyyy"
          inline
        />
      </div>
    );
  }

  const handleSelectedIncludedCategories = (includedCategories) => {
    if (includedCategories.length === 0) {
      handleSelectedAllExpenses()
    } else {
      onUpdateGraphConfig({
        burndownSettings: {
          ...graphConfiguration.burndownSettings,
          filterSettings: {
            ...graphConfiguration.burndownSettings.filterSettings,
            allExpenses: false,
            includedCategories: includedCategories
          }
        }
      });
    }
  }

  const renderFilterExpensesButtons = () => {
    return (
      <div className='creategraphbox__step__bigbuttons'>
        <button
          className={graphConfiguration.burndownSettings.filterSettings.allExpenses === true ? 'selected' : 'not_selected'}
          onClick={handleSelectedAllExpenses}
        >
          <p>All expenses</p>
        </button>
        {renderFilterByCategoryButton()}
      </div>
    );
  }

  const renderStrategyButtons = () => {
    return (
      <div className='creategraphbox__step__bigbuttons'>
        <button
          className={`${graphConfiguration.burndownSettings.type === 'MONTHLY' ? 'selected' : 'not_selected'} small`}
          onClick={() => handleSelectedStrategy('MONTHLY')}
        >
          <p>Monthly</p>
        </button>
        <button
          className={`${graphConfiguration.burndownSettings.type === 'YEARLY' ? 'selected' : 'not_selected'} small`}
          onClick={() => handleSelectedStrategy('YEARLY')}
        >
          <p>Yearly</p>
        </button>
      </div>
    );
  }

  const renderTimeButtons = () => {
    if (graphConfiguration.burndownSettings.type === 'YEARLY') {
      return (
        <div className='creategraphbox__step__bigbuttons'>
          <button
            className={`${graphConfiguration.burndownSettings.dataSettings.time === 'LAST_YEAR' ? 'selected' : 'not_selected'} small`}
            onClick={() => handleSelectedTime('LAST_YEAR')}
          >
            <p>Last year</p>
          </button>
          <button
            className={`${graphConfiguration.burndownSettings.dataSettings.time === 'CUSTOM_YEAR' ? 'selected' : 'not_selected'} small`}
            onClick={() => handleSelectedTime('CUSTOM_YEAR')}
          >
            <p>Custom year</p>
          </button>
        </div>
      );
    }
    return (
      <div className='creategraphbox__step__bigbuttons'>
        <button
          className={`${graphConfiguration.burndownSettings.dataSettings.time === 'LAST_MONTH' ? 'selected' : 'not_selected'} small`}
          onClick={() => handleSelectedTime('LAST_MONTH')}
        >
          <p>Last month</p>
        </button>
        <button
          className={`${graphConfiguration.burndownSettings.dataSettings.time === 'CUSTOM_MONTH' ? 'selected' : 'not_selected'} small`}
          onClick={() => handleSelectedTime('CUSTOM_MONTH')}
        >
          <p>Custom month</p>
        </button>
      </div>
    );
  }

  const renderReferenceButtons = () => {
    if (graphConfiguration.burndownSettings.type === 'YEARLY') {
      return (
        <div className='creategraphbox__step__bigbuttons'>
          <button
            className={`${graphConfiguration.burndownSettings.referenceSettings.type === 'BEST_YEAR' ? 'selected' : 'not_selected'} small`}
            onClick={() => handleSelectedReferenceTime('BEST_YEAR')}
          >
            <p>Best year</p>
          </button>
          <button
            className={`${graphConfiguration.burndownSettings.referenceSettings.type === 'CUSTOM_YEAR' ? 'selected' : 'not_selected'} small`}
            onClick={() => handleSelectedReferenceTime('CUSTOM_YEAR')}
          >
            <p>Custom year</p>
          </button>
        </div>
      );
    }
    return (
      <div className='creategraphbox__step__bigbuttons'>
        <button
          className={`${graphConfiguration.burndownSettings.referenceSettings.type === 'TOTAL_AVERAGE' ? 'selected' : 'not_selected'} small`}
          onClick={() => handleSelectedReferenceTime('TOTAL_AVERAGE')}
        >
          <p>Total average</p>
        </button>
        <button
          className={`${graphConfiguration.burndownSettings.referenceSettings.type === 'LAST_YEAR_AVERAGE' ? 'selected' : 'not_selected'} small`}
          onClick={() => handleSelectedReferenceTime('LAST_YEAR_AVERAGE')}
        >
          <p>Last year average</p>
        </button>
        <button
          className={`${graphConfiguration.burndownSettings.referenceSettings.type === 'BEST_MONTH' ? 'selected' : 'not_selected'} small`}
          onClick={() => handleSelectedReferenceTime('BEST_MONTH')}
        >
          <p>Best month</p>
        </button>
        <button
          className={`${graphConfiguration.burndownSettings.referenceSettings.type === 'CUSTOM_MONTH' ? 'selected' : 'not_selected'} small`}
          onClick={() => handleSelectedReferenceTime('CUSTOM_MONTH')}
        >
          <p>Custom month</p>
        </button>
      </div>
    );
  }

  const renderResolutionButtons = () => {
    const currentResolution = graphConfiguration.burndownSettings?.visualizationSettings?.resolution ?? 'WEEKLY';
    return (
      <div className='creategraphbox__step__bigbuttons scrollable'>
        {RESOLUTION_VALUES.map((value) => (
          <button
            key={value}
            className={`${currentResolution === value ? 'selected' : 'not_selected'} small`}
            onClick={() => handleSelectedResolution(value)}
          >
            <p>{value.charAt(0) + value.slice(1).toLowerCase()}</p>
          </button>
        ))}
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
        <div className={`filterbycategory__bigbutton ${graphConfiguration.burndownSettings.filterSettings.allExpenses === false ? 'selected' : 'not_selected'}`}>
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

  return (
    <div className='creategraphbox__stepcontainer'>
      <div className='creategraphbox__stepcontent'>
        <div className='creategraphbox__stepgraycontainer'>
          <h2>Strategy</h2>
          <p>Do you want to track your spending month by month or year by year?</p>
          {renderStrategyButtons()}
        </div>
        <div className='creategraphbox__stepgraycontainer'>
          <h2>Reference expenses</h2>
          <p>What data do you want to use as a reference?</p>
          {renderReferenceButtons()}
          {graphConfiguration.burndownSettings.referenceSettings.type === 'CUSTOM_MONTH' && renderReferenceMonthPicker()}
          {graphConfiguration.burndownSettings.referenceSettings.type === 'CUSTOM_YEAR' && renderReferenceYearPicker()}
        </div>
        <div className='creategraphbox__stepgraycontainer'>
          <h2>Filter expenses</h2>
          <p>Select all your expenses or filter them</p>
          {renderFilterExpensesButtons()}
        </div>
        <div className='creategraphbox__stepgraycontainer'>
          <h2>Time</h2>
          <p>{graphConfiguration.burndownSettings.type === 'YEARLY' ? 'For which year do you want to see your data?' : 'For which month do you want to see your data?'}</p>
          {renderTimeButtons()}
          {graphConfiguration.burndownSettings.dataSettings.time === 'CUSTOM_MONTH' && renderTimeMonthPicker()}
          {graphConfiguration.burndownSettings.dataSettings.time === 'CUSTOM_YEAR' && renderTimeYearPicker()}
        </div>
        {graphConfiguration.burndownSettings.type === 'YEARLY' && (
          <div className='creategraphbox__stepgraycontainer'>
            <h2>Resolution</h2>
            {renderResolutionButtons()}
          </div>
        )}
      </div>
      <div className='creategraphbox__arrows'>
        <button className='creategraphbox__button back' onClick={gotoBack} disabled={false}>
          Back
        </button>
        <button className='creategraphbox__button next create_graph' onClick={handleCreateGraph} disabled={expensesCategoriesLoading}>
          Create chart
        </button>
      </div>
    </div>
  );
}