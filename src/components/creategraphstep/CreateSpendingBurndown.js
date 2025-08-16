import '../../css/CreateGraphBox.css';
import DatePicker from 'react-datepicker';
import { customStyleForSelectPlacement } from '../../Utils';
import ClipLoader from 'react-spinners/ClipLoader';
import SyncLoader from "react-spinners/SyncLoader";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from 'react';
import Select from 'react-select';
import { createGraph } from '../../RequestUtils';
import { useGlobalStateValue } from '../../context/GlobalStateProvider';
import { actionTypes } from '../../context/globalReducer';

export default function CreateSpendingBurndown({ graphConfiguration, onUpdateGraphConfig, gotoBack, expensesCategoriesLoading, expensesCategories }) {

  const getSelectOptionsFromDatabase = (database) => {
    console.log("input: ", database);
    return database.map(element => {
      return { value: element, label: element };
    });
  }

  // Context
  const [{ userJWTCookie }, dispatch] = useGlobalStateValue();

  const [selectedIncludedCategories, setSelectedIncludedCategories] = useState(getSelectOptionsFromDatabase(graphConfiguration.burndownSettings.filterSettings.includedCategories));
  const [isCreatingGraph, setIsCreatingGraph] = useState(false);

  const closeCreateGraphBox = () => {
    dispatch({
      type: actionTypes.SET_SHOW_CREATE_GRAPH_BOX,
      value: false
    })
  }

  const handleCreateGraph = async () => {
    try {
      setIsCreatingGraph(true);
      const apiResponse = await createGraph(userJWTCookie, graphConfiguration);
      if (apiResponse) {
        console.log("DEBUG JOAQUIN response: ", apiResponse);
      }
    } catch (error) {
      // TODO: handle exception
    } finally {
      setIsCreatingGraph(false);
      closeCreateGraphBox()
    }
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

  const renderReferenceButtons = () => {
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
        </div>
        <div className='creategraphbox__stepgraycontainer'>
          <h2>Filter expenses</h2>
          <p>Select all your expenses or filter them</p>
          {/* {renderFilterExpensesButtons()} */}
        </div>
        <div className='creategraphbox__stepgraycontainer'>
          <h2>Time</h2>
          <p>Which month do you want to see your data?</p>
          {/* {renderTimeButtons()} */}
          {/* {graphConfiguration.burndownSettings.dataSettings.time === 'CUSTOM' && renderDatePicker()} */}
        </div>
      </div>
      <div className='creategraphbox__arrows'>
        <button className='creategraphbox__button back' onClick={gotoBack} disabled={false}>
          Back
        </button>
        <button className='creategraphbox__button next create_graph' onClick={handleCreateGraph} disabled={false}>
          {isCreatingGraph ? <ClipLoader size={15} /> : 'Create graph'}
        </button>
      </div>
    </div>
  );
}