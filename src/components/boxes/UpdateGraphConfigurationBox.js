import '../../css/UpdateGraphConfigurationBox.css';
import { useEffect, useState } from "react";
import { useGlobalStateValue } from "../../context/GlobalStateProvider";
import { actionTypes } from "../../context/globalReducer";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded';

export default function UpdateGraphConfigurationBox() {

  // Context
  const [{ userJWTCookie, editingGraphConfiguration, graphs }, dispatch] = useGlobalStateValue();

  // TODO JOAQUIN: when sending the request, pick the id from 'editingGraphConfiguration'
  // TODO JOAQUIN: I think it should be just one single Visualization step

  useEffect(() => {
    console.log(editingGraphConfiguration);
  }, [editingGraphConfiguration]);

  const closeBox = () => {
    dispatch({
      type: actionTypes.SET_SHOW_UPDATE_GRAPH_CONFIGURATION_BOX,
      value: false
    })
  }

  const handleUpdateGraphConfiguration = async () => {
    const graphConfigId = editingGraphConfiguration.id;
    const updatedGraphs = graphs.map((graph) => {
      if (graph.graphConfiguration.id === graphConfigId) {
        return {
          ...graph,
          graphConfiguration: editingGraphConfiguration
        }
      } else {
        return graph;
      }
    });
    dispatch({
      type: actionTypes.SET_GRAPHS,
      value: updatedGraphs
    })
    dispatch({
      type: actionTypes.SET_SHOW_UPDATE_GRAPH_CONFIGURATION_BOX,
      value: false
    })
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

  const renderHeading = () => {
    if (editingGraphConfiguration.customGraphSettings.dataSettings.source === "EXPENSES") {
      return (
        <div className='creategraphbox__heading last_step'>
          <h2>Expenses</h2>
          <TrendingDownRoundedIcon fontSize='medium' />
        </div>
      );
    } else if (editingGraphConfiguration.customGraphSettings.dataSettings.source === "INCOMES") {
      return (
        <div className='creategraphbox__heading last_step'>
          <h2>Incomes</h2>
          <AttachMoneyRoundedIcon fontSize='medium' />
        </div>
      );
    } else {
      return (
        <div className='creategraphbox__heading last_step'>
          <h2>Savings</h2>
          <TrendingUpRoundedIcon fontSize='medium' />
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