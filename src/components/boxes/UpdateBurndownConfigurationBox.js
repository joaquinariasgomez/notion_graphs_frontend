import '../../css/UpdateGraphConfigurationBox.css';
import { useState } from "react";
import { useGlobalStateValue } from "../../context/GlobalStateProvider";
import { actionTypes } from "../../context/globalReducer";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import { updateGraphConfiguration } from '../../api/RequestUtils';
import { getGraphTitleFromConfiguration } from '../graphsdisplay/GraphsDisplayUtils';

const RESOLUTION_VALUES = ['DAILY', 'WEEKLY', 'MONTHLY'];

export default function UpdateBurndownConfigurationBox() {

  // Context
  const [{ userJWTCookie, editingGraphConfiguration, graphs }, dispatch] = useGlobalStateValue();

  const [isEditingCustomTitle, setIsEditingCustomTitle] = useState(false);
  const [temporalCustomTitle, setTemporalCustomTitle] = useState("");

  const closeBox = () => {
    dispatch({
      type: actionTypes.CLOSE_ACTIVE_BOX
    });
  }

  const handleUpdateGraphConfiguration = async () => {
    closeBox();
    const graphConfigId = editingGraphConfiguration.id;
    const graphToUpdate = graphs.find(
      (graph) => graph.graphConfiguration.id === graphConfigId
    );

    if (graphToUpdate) {
      const updatedGraph = {
        ...graphToUpdate,
        graphConfiguration: editingGraphConfiguration
      };
      dispatch({
        type: actionTypes.UPDATE_GRAPH,
        payload: {
          id: graphConfigId,
          data: updatedGraph
        }
      });
      try {
        await updateGraphConfiguration(userJWTCookie, graphConfigId, editingGraphConfiguration);
      } catch (error) {
        // TODO: handle exception
      } finally { }
    }
  }

  const handleSelectedResolution = (resolution) => {
    const bs = editingGraphConfiguration.burndownSettings;
    dispatch({
      type: actionTypes.SET_EDITING_GRAPH_CONFIGURATION,
      value: {
        ...editingGraphConfiguration,
        burndownSettings: {
          ...bs,
          visualizationSettings: {
            ...(bs.visualizationSettings ?? {}),
            resolution
          }
        }
      }
    });
  }

  const handleClickEditCustomTitle = () => {
    setTemporalCustomTitle(renderCustomTitleText());
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
      };
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
              autoFocus
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
    return (
      <div className='creategraphbox__heading last_step'>
        <h2>Burndown</h2>
        <TrendingDownRoundedIcon fontSize='medium' />
        {renderEditCustomTitle()}
      </div>
    );
  }

  const renderResolutionButtons = () => {
    const currentResolution = editingGraphConfiguration.burndownSettings?.visualizationSettings?.resolution ?? 'DAILY';
    return (
      <div className='creategraphbox__stepgraycontainer'>
        <h2>Resolution</h2>
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
      </div>
    );
  }

  const renderContent = () => {
    const isYearly = editingGraphConfiguration.burndownSettings?.type === 'YEARLY';
    return (
      <>
        {isYearly && renderResolutionButtons()}
      </>
    );
  }

  return (
    <div className='box__backdrop' onClick={closeBox}>
      <div className='creategraphbox__container' onClick={e => { e.stopPropagation(); }}>
        <button className='creategraphbox__cancelbutton' onClick={closeBox}>
          <CloseRoundedIcon fontSize='medium' />
        </button>
        <h1>Edit Burndown</h1>
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
