import { useSortable } from "@dnd-kit/sortable";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import DeleteIcon from '@mui/icons-material/Delete';
import CachedIcon from '@mui/icons-material/Cached';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import BarChartIcon from '@mui/icons-material/BarChart';
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import { useEffect, useRef, useState } from "react";
import GraphDisplayer from "./graphsdisplay/GraphDisplayer";
import SyncLoader from "react-spinners/SyncLoader";
import { getGraphTitle, getGraphTitleFromConfiguration, getGraphPeriodInfo, getGraphFilterInfo } from "./graphsdisplay/GraphsDisplayUtils";
import { useGlobalStateValue } from "../context/GlobalStateProvider";
import { actionTypes, BOX_TYPES } from "../context/globalReducer";
import { deleteGraph, refreshGraph } from "../api/RequestUtils";
import { getRelativeTimeFromTimestamp } from "../utils/DateUtils";
import { FaSyncAlt } from 'react-icons/fa';

export default function GraphBox({ graph }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: graph.graphConfiguration.id }); // Use a unique ID from my data

    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    // Context
    const [{ userJWTCookie }, dispatch] = useGlobalStateValue();

    const [isRefreshing, setIsRefreshing] = useState(graph.graphConfiguration.graphCreationStatus === 'UPDATING');
    const [showMoreOptions, setShowMoreOptions] = useState(false);
    const showMoreOptionsRef = useRef(null);
    const moreSettingsButtonRef = useRef(null);
    const [showInfo, setShowInfo] = useState(false);
    const infoPopupRef = useRef(null);
    const infoButtonRef = useRef(null);
    const [showLegend, setShowLegend] = useState(true);
    const [showAverages, setShowAverages] = useState(false);
    const [showStandardDeviation, setShowStandardDeviation] = useState(false);
    const [frequencyView, setFrequencyView] = useState('BUBBLE');

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (showMoreOptions && showMoreOptionsRef.current && !showMoreOptionsRef.current.contains(event.target) && moreSettingsButtonRef.current && !moreSettingsButtonRef.current.contains(event.target)) {
                handleCloseShowMoreOptions();
            }
        }
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        }
    }, [showMoreOptions]);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (showInfo && infoPopupRef.current && !infoPopupRef.current.contains(event.target) && infoButtonRef.current && !infoButtonRef.current.contains(event.target)) {
                handleCloseShowInfo();
            }
        }
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        }
    }, [showInfo]);

    const handleClickUpdateGraphConfiguration = (graph) => {
        dispatch({
            type: actionTypes.SET_EDITING_GRAPH_CONFIGURATION,
            value: graph.graphConfiguration
        })
        dispatch({
            type: actionTypes.SET_ACTIVE_BOX,
            value: { type: BOX_TYPES.UPDATE_GRAPH }
        })
    }

    const handleClickShowMoreOptions = () => {
        setShowMoreOptions(!showMoreOptions);
    }

    const handleCloseShowMoreOptions = () => {
        setShowMoreOptions(false);
    }

    const handleClickShowInfo = () => {
        setShowInfo(!showInfo);
    }

    const handleCloseShowInfo = () => {
        setShowInfo(false);
    }

    const handleRefreshGraph = async (graph) => {
        try {
            setIsRefreshing(true);
            const graphConfigId = graph.graphConfiguration.id;
            const apiResponse = await refreshGraph(userJWTCookie, graphConfigId);
            if (apiResponse) {
                dispatch({
                    type: actionTypes.UPDATE_GRAPH,
                    payload: {
                        id: graphConfigId,
                        data: apiResponse
                    }
                })
            }
        } catch (error) {
            // TODO: handle exception
        } finally {
            setIsRefreshing(false);
        }
    }

    const handleDeleteGraph = (graph) => {
        dispatch({
            type: actionTypes.DELETE_GRAPH,
            value: graph.graphConfiguration.id
        })
        try {
            deleteGraph(userJWTCookie, graph.graphConfiguration.id);
        } catch (error) {

        }
    }

    const handleToggleShowLegend = () => {
        setShowLegend(!showLegend);
    }

    const handleToggleShowAverages = () => {
        setShowAverages(!showAverages);
    }

    const handleToggleShowStandardDeviation = () => {
        setShowStandardDeviation(!showStandardDeviation);
    }

    const handleToggleFrequencyView = () => {
        setFrequencyView(prev => (prev === 'BUBBLE' ? 'BAR' : 'BUBBLE'));
    }

    const isBurndownGraph = (graph) => {
        return graph.graphConfiguration.requestType === 'BURNDOWN';
    }

    const renderMoreOptionsButton = (graph) => {
        // Wont show for heat charts or burndown charts
        const isHeatChart = graph.graphConfiguration.requestType === 'CUSTOM_GRAPH' && graph.graphConfiguration.customGraphSettings.visualizationSettings.type === 'HEAT';
        if (!isBurndownGraph(graph) && !isHeatChart) {
            return (
                <button ref={moreSettingsButtonRef} className="graphbox__more_settings" title="Options" onClick={handleClickShowMoreOptions} >
                    <MoreHorizIcon style={{ color: '#6d6d6d' }} fontSize="small" />
                    {renderMoreOptionsMenu()}
                </button>
            );
        }
    }

    const renderFrequencyViewToggleButton = (graph) => {
        const isFrequencyChart = graph.graphConfiguration.requestType === 'CUSTOM_GRAPH' && graph.graphConfiguration.customGraphSettings.visualizationSettings.type === 'FREQUENCY';
        if (isFrequencyChart) {
            const switchingToBar = frequencyView === 'BUBBLE';
            return (
                <button className="graphbox__refresh" title={switchingToBar ? 'Switch to bar view' : 'Switch to bubble view'} onClick={handleToggleFrequencyView}>
                    {switchingToBar
                        ? <BarChartIcon style={{ color: '#6d6d6d' }} fontSize="small" />
                        : <BubbleChartIcon style={{ color: '#6d6d6d' }} fontSize="small" />}
                </button>
            );
        }
    }

    const renderUpdateConfigButton = (graph) => {
        if (!isBurndownGraph(graph)) {
            return (
                <button className="graphbox__updateconfig" title="Update configuration" onClick={() => handleClickUpdateGraphConfiguration(graph)}>
                    <TuneRoundedIcon style={{ color: '#6d6d6d' }} fontSize="small" />
                </button>
            );
        }
    }

    const renderGraph = (graph) => {
        const graphCreationStatus = graph.graphConfiguration.graphCreationStatus;
        switch (graphCreationStatus) {
            case "UPDATING":
            case "CREATED":
                return (
                    <GraphDisplayer graphConfiguration={graph.graphConfiguration} graphData={graph.graphData} showLegend={showLegend} showAverages={showAverages} showStandardDeviation={showStandardDeviation} showTitle={true} frequencyView={frequencyView} />
                );
            case "PENDING":
                return (
                    <div className="loading">
                        <p className="title">
                            {getGraphTitle(graph.graphConfiguration)}
                        </p>
                        <SyncLoader size={14} style={{ color: '#6d6d6d' }} />
                    </div>
                );
            default:
            case "ERROR":
                return (
                    <div className="showingerror">
                        <p className="title">
                            {getGraphTitle(graph.graphConfiguration)}
                        </p>
                        <p className="warning-sign">
                            ⚠️
                        </p>
                        <p className="error-message">
                            We couldn't load this chart due to an error with your Notion integration.<br></br><br></br>Please try reconnecting or logging in again to refresh the cookies.
                        </p>
                        <button
                            className="error-button"
                            onClick={() => {
                                dispatch({
                                    type: actionTypes.SET_ACTIVE_BOX,
                                    value: {
                                        type: BOX_TYPES.PROFILE,
                                        data: { panel: 'walletconnection' }
                                    }
                                })
                            }}
                        >
                            Check Notion Connection
                        </button>
                        <button
                            className="refresh-button"
                            onClick={() => handleRefreshGraph(graph)} disabled={isRefreshing}
                        >
                            <FaSyncAlt className={`graph-refresh-button__icon ${isRefreshing ? 'spinning' : ''}`} />
                            Refresh Chart
                        </button>
                    </div>
                );
        }
    }

    const renderShowLegendDropdown = () => {
        // Only will show for grouped charts
        const isGroupedByCategory = graph.graphConfiguration.requestType === 'CUSTOM_GRAPH' && graph.graphConfiguration.customGraphSettings.visualizationSettings.groupByCategory === true;
        const isGroupedByIncomeBankAccounts = graph.graphConfiguration.requestType === 'CUSTOM_GRAPH' && graph.graphConfiguration.customGraphSettings.visualizationSettings.groupByIncomeBankAccounts === true;
        const isGroupedByIncomeSources = graph.graphConfiguration.requestType === 'CUSTOM_GRAPH' && graph.graphConfiguration.customGraphSettings.visualizationSettings.groupByIncomeSources === true;
        if (isGroupedByCategory || isGroupedByIncomeBankAccounts || isGroupedByIncomeSources) {
            return (
                <div className="dropdown-item">
                    <p>Show legend</p>
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            checked={showLegend}
                            onChange={handleToggleShowLegend}
                        />
                        <span className="slider"></span>
                    </label>
                </div>
            );
        }
    }

    const renderShowAvgAndStdDropdowns = () => {
        // Wont show these options for Heat or Frequency charts
        const isHeatChart = graph.graphConfiguration.requestType === 'CUSTOM_GRAPH' && graph.graphConfiguration.customGraphSettings.visualizationSettings.type === 'HEAT';
        const isFrequencyChart = graph.graphConfiguration.requestType === 'CUSTOM_GRAPH' && graph.graphConfiguration.customGraphSettings.visualizationSettings.type === 'FREQUENCY';
        if (!isHeatChart && !isFrequencyChart) {
            return (
                <>
                    <div className="dropdown-item">
                        <p>Show average</p>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={showAverages}
                                onChange={handleToggleShowAverages}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>
                    <div className="dropdown-item">
                        <p>Show standard deviation</p>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={showStandardDeviation}
                                onChange={handleToggleShowStandardDeviation}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>
                </>
            );
        }
    }

    const renderInfoMenu = () => {
        const periodInfo = getGraphPeriodInfo(graph.graphConfiguration);
        const filterInfo = getGraphFilterInfo(graph.graphConfiguration);
        return (
            <div
                ref={infoPopupRef}
                className={`graphbox__info__container ${showInfo ? 'is-open' : ''}`}
                onClick={e => e.stopPropagation()}
            >
                <p className="graphbox__info__section-title">Time period</p>
                {periodInfo.map(({ label, value }) => (
                    <div key={label} className="graphbox__info__row">
                        <span className="graphbox__info__label">{label}</span>
                        <span className="graphbox__info__value">{value}</span>
                    </div>
                ))}
                <p className="graphbox__info__section-title">Filters</p>
                {filterInfo.map(({ label, values }) => (
                    <div key={label} className="graphbox__info__row">
                        <span className="graphbox__info__label">{label}</span>
                        <span className="graphbox__info__value">{values.join(', ')}</span>
                    </div>
                ))}
            </div>
        );
    }

    const renderMoreOptionsMenu = () => {
        return (
            <div
                ref={showMoreOptionsRef}
                className={`graphbox__moresettings__container ${showMoreOptions ? 'is-open' : ''}`}
                onClick={e => e.stopPropagation()}
            >
                {renderShowLegendDropdown()}
                {renderShowAvgAndStdDropdowns()}
            </div>
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            className="graphbox"
        >
            <div {...listeners} className="graphbox__drag-handle">
                <DragIndicatorIcon style={{ color: '#a0a0a0ff' }} sx={{ cursor: 'grab' }} />
            </div>
            <div className="graphbox__header">
                <div className="graphbox__updatedAt" title="Last graph update">
                    <p>{getRelativeTimeFromTimestamp(graph.updatedAt)}</p>
                </div>
                <button ref={infoButtonRef} className="graphbox__info" title="Chart info" onClick={handleClickShowInfo}>
                    <InfoOutlinedIcon style={{ color: '#6d6d6d' }} fontSize="small" />
                    {renderInfoMenu()}
                </button>
                <button className="graphbox__refresh" title="Refresh graph" onClick={() => handleRefreshGraph(graph)} disabled={isRefreshing}>
                    <FaSyncAlt className={`graph-refresh-button__icon ${isRefreshing ? 'spinning' : ''}`} />
                </button>
                {renderFrequencyViewToggleButton(graph)}
                {renderMoreOptionsButton(graph)}
                {renderUpdateConfigButton(graph)}
                <button className="graphbox__delete" title="Delete" onClick={() => handleDeleteGraph(graph)}>
                    <DeleteIcon style={{ color: '#f14668' }} fontSize="small" />
                </button>
            </div>
            <div className="graphbox__graph">
                {renderGraph(graph)}
            </div>
        </div >
    );
}