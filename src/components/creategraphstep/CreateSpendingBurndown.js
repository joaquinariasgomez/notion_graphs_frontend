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

  const closeCreateGraphBox = () => {
    dispatch({
      type: actionTypes.SET_SHOW_CREATE_GRAPH_BOX,
      value: false
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
      // If backend responds with 400 error, show error and remove last appended pending graph
      if (error && error.response && error.response.status === 400) {
        let message = "An error occurred while creating the graph: " + error.response.data;
        if (error.response.data && error.response.data.message) {
          message = error.response.data.message;
        }
        window.alert(message);
        dispatch({
          type: actionTypes.DELETE_GRAPH,
          value: pendingGraphConfiguration.graphConfiguration.id
        });
      }
      // Optionally handle other errors as needed
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

  const renderTimeButtons = () => {
    return (
      <div className='creategraphbox__step__bigbuttons'>
        <button
          className={`${graphConfiguration.burndownSettings.dataSettings.time === 'LAST_MONTH' ? 'selected' : 'not_selected'} small`}
          onClick={() => handleSelectedTime('LAST_MONTH')}
        >
          <p>Last month</p>
        </button>
        <button
          className={`${graphConfiguration.burndownSettings.dataSettings.time === 'CUSTOM' ? 'selected' : 'not_selected'} small`}
          onClick={() => handleSelectedTime('CUSTOM')}
        >
          <p>Custom month</p>
        </button>
      </div>
    );
  }

  const renderReferenceButtons = () => {
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
          className={`${graphConfiguration.burndownSettings.referenceSettings.type === 'CUSTOM' ? 'selected' : 'not_selected'} small`}
          onClick={() => handleSelectedReferenceTime('CUSTOM')}
        >
          <p>Custom month</p>
        </button>
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
          <h2>Reference expenses</h2>
          <p>What data do you want to use as a reference?</p>
          {renderReferenceButtons()}
          {graphConfiguration.burndownSettings.referenceSettings.type === 'CUSTOM' && renderReferenceMonthPicker()}
        </div>
        <div className='creategraphbox__stepgraycontainer'>
          <h2>Filter expenses</h2>
          <p>Select all your expenses or filter them</p>
          {renderFilterExpensesButtons()}
        </div>
        <div className='creategraphbox__stepgraycontainer'>
          <h2>Time</h2>
          <p>For which month do you want to see your data?</p>
          {renderTimeButtons()}
          {graphConfiguration.burndownSettings.dataSettings.time === 'CUSTOM' && renderTimeMonthPicker()}
        </div>
      </div>
      <div className='creategraphbox__arrows'>
        <button className='creategraphbox__button back' onClick={gotoBack} disabled={false}>
          Back
        </button>
        <button className='creategraphbox__button next create_graph' onClick={handleCreateGraph} disabled={expensesCategoriesLoading}>
          Create graph
        </button>
      </div>
    </div>
  );
}