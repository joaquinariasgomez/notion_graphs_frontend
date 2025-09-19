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
  const [{ userJWTCookie, editingGraphConfiguration }, dispatch] = useGlobalStateValue();

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