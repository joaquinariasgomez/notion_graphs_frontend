import '../../css/UpdateGraphConfigurationBox.css';
import { useEffect, useState } from "react";
import { useGlobalStateValue } from "../../context/GlobalStateProvider";
import { actionTypes } from "../../context/globalReducer";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded';
import { updateGraphConfiguration } from '../../api/RequestUtils';
import { getGraphTitleFromConfiguration } from '../graphsdisplay/GraphsDisplayUtils';

export default function UpdateGraphConfigurationBox() {

  // Context
  const [{ userJWTCookie, editingGraphConfiguration, graphs }, dispatch] = useGlobalStateValue();

  const [isEditingCustomTitle, setIsEditingCustomTitle] = useState(false);
  const [temporalCustomTitle, setTemporalCustomTitle] = useState("");

  // useEffect(() => {
  //   console.log(editingGraphConfiguration);
  // }, [editingGraphConfiguration]);

  const closeBox = () => {
    dispatch({
      type: actionTypes.CLOSE_ACTIVE_BOX
    })
  }

  const handleUpdateGraphConfiguration = async () => {
    closeBox()
    const graphConfigId = editingGraphConfiguration.id;
    const graphToUpdate = graphs.find(
      (graph) => graph.graphConfiguration.id === graphConfigId
    );

    if (graphToUpdate) {
      const updatedGraph = {
        ...graphToUpdate,
        graphConfiguration: editingGraphConfiguration
      }
      dispatch({
        type: actionTypes.UPDATE_GRAPH,
        payload: {
          id: graphConfigId,
          data: updatedGraph
        }
      })
      try {
        await updateGraphConfiguration(userJWTCookie, graphConfigId, editingGraphConfiguration);
      } catch (error) {
        // TODO: handle exception
      } finally { }
    }
  }

  const handleSelectedVisualizationType = (type) => {
    const newEditingGraphConfiguration = {
      ...editingGraphConfiguration,
      customGraphSettings: {
        ...editingGraphConfiguration.customGraphSettings,
        visualizationSettings: {
          ...editingGraphConfiguration.customGraphSettings.visualizationSettings,
          type: type
        }
      }
    }
    dispatch({
      type: actionTypes.SET_EDITING_GRAPH_CONFIGURATION,
      value: newEditingGraphConfiguration
    });
  }

  const handleSelectedGroupByTime = (groupByTime) => {
    const newEditingGraphConfiguration = {
      ...editingGraphConfiguration,
      customGraphSettings: {
        ...editingGraphConfiguration.customGraphSettings,
        visualizationSettings: {
          ...editingGraphConfiguration.customGraphSettings.visualizationSettings,
          groupByTime: groupByTime
        }
      }
    }
    dispatch({
      type: actionTypes.SET_EDITING_GRAPH_CONFIGURATION,
      value: newEditingGraphConfiguration
    });
  }

  const handleSelectedGroupByIncomeBankAccountsCategory = () => {
    let newEditingGraphConfiguration;
    if (editingGraphConfiguration.customGraphSettings.visualizationSettings.groupByIncomeBankAccounts === true) {
      newEditingGraphConfiguration = {
        ...editingGraphConfiguration,
        customGraphSettings: {
          ...editingGraphConfiguration.customGraphSettings,
          visualizationSettings: {
            ...editingGraphConfiguration.customGraphSettings.visualizationSettings,
            groupByIncomeBankAccounts: false
          }
        }
      }
    } else {
      newEditingGraphConfiguration = {
        ...editingGraphConfiguration,
        customGraphSettings: {
          ...editingGraphConfiguration.customGraphSettings,
          visualizationSettings: {
            ...editingGraphConfiguration.customGraphSettings.visualizationSettings,
            groupByIncomeBankAccounts: true,
            groupByIncomeSources: false
          }
        }
      }
    }
    dispatch({
      type: actionTypes.SET_EDITING_GRAPH_CONFIGURATION,
      value: newEditingGraphConfiguration
    });
  }

  const handleSelectedGroupByIncomeSourcesCategory = () => {
    let newEditingGraphConfiguration;
    if (editingGraphConfiguration.customGraphSettings.visualizationSettings.groupByIncomeSources === true) {
      newEditingGraphConfiguration = {
        ...editingGraphConfiguration,
        customGraphSettings: {
          ...editingGraphConfiguration.customGraphSettings,
          visualizationSettings: {
            ...editingGraphConfiguration.customGraphSettings.visualizationSettings,
            groupByIncomeSources: false
          }
        }
      }
    } else {
      newEditingGraphConfiguration = {
        ...editingGraphConfiguration,
        customGraphSettings: {
          ...editingGraphConfiguration.customGraphSettings,
          visualizationSettings: {
            ...editingGraphConfiguration.customGraphSettings.visualizationSettings,
            groupByIncomeSources: true,
            groupByIncomeBankAccounts: false
          }
        }
      }
    }
    dispatch({
      type: actionTypes.SET_EDITING_GRAPH_CONFIGURATION,
      value: newEditingGraphConfiguration
    });
  }

  const handleSelectedGroupByCategory = () => {
    const newValue = !editingGraphConfiguration.customGraphSettings.visualizationSettings.groupByCategory;
    const newEditingGraphConfiguration = {
      ...editingGraphConfiguration,
      customGraphSettings: {
        ...editingGraphConfiguration.customGraphSettings,
        visualizationSettings: {
          ...editingGraphConfiguration.customGraphSettings.visualizationSettings,
          groupByCategory: newValue
        }
      }
    }
    dispatch({
      type: actionTypes.SET_EDITING_GRAPH_CONFIGURATION,
      value: newEditingGraphConfiguration
    });
  }

  const handleSelectedCumulative = () => {
    const newValue = !editingGraphConfiguration.customGraphSettings.visualizationSettings.cumulative;
    const newEditingGraphConfiguration = {
      ...editingGraphConfiguration,
      customGraphSettings: {
        ...editingGraphConfiguration.customGraphSettings,
        visualizationSettings: {
          ...editingGraphConfiguration.customGraphSettings.visualizationSettings,
          cumulative: newValue
        }
      }
    }
    dispatch({
      type: actionTypes.SET_EDITING_GRAPH_CONFIGURATION,
      value: newEditingGraphConfiguration
    });
  }

  const handleClickEditCustomTitle = () => {
    setIsEditingCustomTitle(true);
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleDoneEditClick();
    }
  };

  const handleInputChange = (e) => {
    setTemporalCustomTitle(e.target.value);
  };

  const handleCancelEditClick = () => {
    setIsEditingCustomTitle(false);
  }

  const handleDoneEditClick = () => {
    setIsEditingCustomTitle(false);
    if (temporalCustomTitle !== null && temporalCustomTitle !== "") {
      const newEditingGraphConfiguration = {
        ...editingGraphConfiguration,
        customTitle: temporalCustomTitle
      }
      dispatch({
        type: actionTypes.SET_EDITING_GRAPH_CONFIGURATION,
        value: newEditingGraphConfiguration
      });
    }
  }

  const renderCustomTitleText = () => {
    const textValue = editingGraphConfiguration.customTitle;
    if (textValue === null) {
      return getGraphTitleFromConfiguration(editingGraphConfiguration);
    } else {
      return textValue;
    }
  }

  const renderEditCustomTitle = () => {
    return (
      <div className='editcustomtitle__container'>
        {isEditingCustomTitle ? (
          <>
            <input
              type="text"
              value={temporalCustomTitle}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder='Edit title...'
              autoFocus // Automatically focus the input field
            />
            <button onClick={handleCancelEditClick}>
              <CloseIcon style={{ color: '#000000' }} />
            </button>
            <button onClick={handleDoneEditClick}>
              <DoneIcon style={{ color: '#000000' }} />
            </button>
          </>
        ) : (
          <>
            <h2>{renderCustomTitleText()}</h2>
            <button onClick={handleClickEditCustomTitle}>
              <EditIcon style={{ color: '#000000' }} />
            </button>
          </>
        )}
      </div>
    );
  }

  const renderHeading = () => {
    if (editingGraphConfiguration.customGraphSettings.dataSettings.source === "EXPENSES") {
      return (
        <div className='creategraphbox__heading last_step'>
          <h2>Expenses</h2>
          <TrendingDownRoundedIcon fontSize='medium' />
          {renderEditCustomTitle()}
        </div>
      );
    } else if (editingGraphConfiguration.customGraphSettings.dataSettings.source === "INCOMES") {
      return (
        <div className='creategraphbox__heading last_step'>
          <h2>Incomes</h2>
          <AttachMoneyRoundedIcon fontSize='medium' />
          {renderEditCustomTitle()}
        </div>
      );
    } else {
      return (
        <div className='creategraphbox__heading last_step'>
          <h2>Savings</h2>
          <TrendingUpRoundedIcon fontSize='medium' />
          {renderEditCustomTitle()}
        </div>
      );
    }
  }

  const renderContent = () => {
    return (
      <>
        <div className='creategraphbox__stepgraycontainer'>
          <h2>Visualization</h2>
          {renderVisualizationButtons()}
        </div>
        <div className='creategraphbox__stepgraycontainer'>
          <h2>Group by time</h2>
          {renderGroupByTimeButtons()}
        </div>
        <div className='creategraphbox__stepgraycontainer'>
          {renderOnOffButtons()} {/* Group by category and Cumulative results buttons */}
        </div>
      </>
    );
  }

  const renderVisualizationButtons = () => {
    return (
      <div className='creategraphbox__step__bigbuttons'>
        <button
          className={`${editingGraphConfiguration.customGraphSettings.visualizationSettings.type === 'LINE' ? 'selected' : 'not_selected'} small`}
          onClick={() => handleSelectedVisualizationType('LINE')}
        >
          {renderLineChartText()}
        </button>
        <button
          className={`${editingGraphConfiguration.customGraphSettings.visualizationSettings.type === 'BAR' ? 'selected' : 'not_selected'} small`}
          onClick={() => handleSelectedVisualizationType('BAR')}
        >
          {renderBarChartText()}
        </button>
        <button
          className={`${editingGraphConfiguration.customGraphSettings.visualizationSettings.type === 'HEAT' ? 'selected' : 'not_selected'} small`}
          onClick={() => handleSelectedVisualizationType('HEAT')}
        >
          {renderHeatChartText()}
        </button>
      </div>
    );
  }

  const renderLineChartText = () => {
    if ((editingGraphConfiguration.customGraphSettings.dataSettings.source === "EXPENSES" && editingGraphConfiguration.customGraphSettings.visualizationSettings.groupByCategory === true) || (editingGraphConfiguration.customGraphSettings.dataSettings.source === "INCOMES" && editingGraphConfiguration.customGraphSettings.visualizationSettings.groupByIncomeBankAccounts === true || editingGraphConfiguration.customGraphSettings.visualizationSettings.groupByIncomeSources === true)) {
      return (
        <p>Multiline chart</p>
      );
    } else {
      return (
        <p>Line chart</p>
      );
    }
  }

  const renderBarChartText = () => {
    if ((editingGraphConfiguration.customGraphSettings.dataSettings.source === "EXPENSES" && editingGraphConfiguration.customGraphSettings.visualizationSettings.groupByCategory === true) || (editingGraphConfiguration.customGraphSettings.dataSettings.source === "INCOMES" && editingGraphConfiguration.customGraphSettings.visualizationSettings.groupByIncomeBankAccounts === true || editingGraphConfiguration.customGraphSettings.visualizationSettings.groupByIncomeSources === true)) {
      return (
        <p>Multibar chart</p>
      );
    } else {
      return (
        <p>Bar chart</p>
      );
    }
  }

  const renderHeatChartText = () => {
    return (
      <p>Heat chart</p>
    );
  }

  const renderGroupByTimeButtons = () => {
    return (
      <div className='creategraphbox__step__bigbuttons'>
        <button
          className={`${editingGraphConfiguration.customGraphSettings.visualizationSettings.groupByTime === 'DAY' ? 'selected' : 'not_selected'} small`}
          onClick={() => handleSelectedGroupByTime('DAY')}
        >
          <p>Day</p>
        </button>
        <button
          className={`${editingGraphConfiguration.customGraphSettings.visualizationSettings.groupByTime === 'WEEK' ? 'selected' : 'not_selected'} small`}
          onClick={() => handleSelectedGroupByTime('WEEK')}
        >
          <p>Week</p>
        </button>
        <button
          className={`${editingGraphConfiguration.customGraphSettings.visualizationSettings.groupByTime === 'MONTH' ? 'selected' : 'not_selected'} small`}
          onClick={() => handleSelectedGroupByTime('MONTH')}
        >
          <p>Month</p>
        </button>
        <button
          className={`${editingGraphConfiguration.customGraphSettings.visualizationSettings.groupByTime === 'YEAR' ? 'selected' : 'not_selected'} small`}
          onClick={() => handleSelectedGroupByTime('YEAR')}
        >
          <p>Year</p>
        </button>
      </div>
    );
  }

  const renderOnOffButtons = () => {
    return (
      <div className='creategraphbox__step__bigbuttons notitle'>
        {renderGroupByCategoriesButtons()}
        <button
          className={`${editingGraphConfiguration.customGraphSettings.visualizationSettings.cumulative === true ? 'selected' : 'not_selected'} small`}
          onClick={handleSelectedCumulative}
        >
          <p>Cumulative results</p>
        </button>
      </div>
    );
  }

  const renderGroupByCategoriesButtons = () => {
    if (editingGraphConfiguration.customGraphSettings.dataSettings.source === 'EXPENSES') {
      return (
        <button
          className={`${editingGraphConfiguration.customGraphSettings.visualizationSettings.groupByCategory === true ? 'selected' : 'not_selected'} small`}
          onClick={handleSelectedGroupByCategory}
        >
          <p>Group by category</p>
        </button>
      );
    } else if (editingGraphConfiguration.customGraphSettings.dataSettings.source === 'INCOMES') {
      return (
        <>
          <button
            className={`${editingGraphConfiguration.customGraphSettings.visualizationSettings.groupByIncomeBankAccounts === true ? 'selected' : 'not_selected'} small`}
            onClick={handleSelectedGroupByIncomeBankAccountsCategory}
          >
            <p>Group by bank account</p>
          </button >
          <button
            className={`${editingGraphConfiguration.customGraphSettings.visualizationSettings.groupByIncomeSources === true ? 'selected' : 'not_selected'} small`}
            onClick={handleSelectedGroupByIncomeSourcesCategory}
          >
            <p>Group by income source</p>
          </button>
        </>
      );
    } else {
      return (<></>);
    }
  }

  return (
    <div className='box__backdrop' onClick={closeBox}>
      <div className='creategraphbox__container' onClick={e => { e.stopPropagation(); }}>
        <button className='creategraphbox__cancelbutton' onClick={closeBox}>
          <CloseRoundedIcon fontSize='medium' />
        </button>
        <h1>Edit Graph</h1>
        <div className='creategraphbox__stepcontainer'>
          <div className='creategraphbox__stepcontent'>
            {renderHeading()}
            {renderContent()}
          </div>
          <div className='creategraphbox__arrows'>
            <button className='creategraphbox__button cancel' onClick={closeBox}>
              Cancel
            </button>
            <button className='creategraphbox__button next create_graph' onClick={handleUpdateGraphConfiguration}>
              Update graph
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}