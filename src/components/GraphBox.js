import { useSortable } from "@dnd-kit/sortable";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import DeleteIcon from '@mui/icons-material/Delete';
import CachedIcon from '@mui/icons-material/Cached';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import { useEffect, useState } from "react";
import GraphDisplayer from "./graphsdisplay/GraphDisplayer";
import SyncLoader from "react-spinners/SyncLoader";
import { getGraphTitleFromConfiguration } from "./graphsdisplay/GraphsDisplayUtils";
import { useGlobalStateValue } from "../context/GlobalStateProvider";
import { actionTypes } from "../context/globalReducer";
import { deleteGraph, refreshGraph } from "../api/RequestUtils";
import { getRelativeTimeFromTimestamp } from "../utils/DateUtils";

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

    const handleClickUpdateGraphConfiguration = (graph) => {
        dispatch({
            type: actionTypes.SET_SHOW_UPDATE_GRAPH_CONFIGURATION_BOX,
            value: true
        })
        dispatch({
            type: actionTypes.SET_EDITING_GRAPH_CONFIGURATION,
            value: graph.graphConfiguration
        })
    }

    const handleClickShowMoreOptions = () => {
        setShowMoreOptions(!showMoreOptions);
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

    const isBurndownGraph = (graph) => {
        return graph.graphConfiguration.requestType === 'BURNDOWN';
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
                    <GraphDisplayer graphConfiguration={graph.graphConfiguration} graphData={graph.graphData} />
                );
            case "PENDING":
                return (
                    <div className="loading">
                        <p className="title">
                            {getGraphTitleFromConfiguration(graph.graphConfiguration)}
                        </p>
                        <SyncLoader size={14} style={{ color: '#6d6d6d' }} />
                    </div>
                );
            default:
            case "ERROR":
                {/* TODO JOAQUIN - fill */ }
                return (<></>);
        }
    }

    const renderMoreOptionsMenu = () => {
        return (
            <div className={`graphbox__moresettings__container ${showMoreOptions ? 'is-open' : ''}`} onClick={e => { e.stopPropagation(); }}>
                <div className="dropdown-item">
                    <span>Show legend</span>
                    <label className="toggle-switch">
                        <input type="checkbox" />
                        <span className="slider"></span>
                    </label>
                </div>
                <div className="dropdown-item">
                    <span>Show averages</span>
                    <label className="toggle-switch">
                        <input type="checkbox" />
                        <span className="slider"></span>
                    </label>
                </div>
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
                <button className="graphbox__refresh" title="Refresh graph" onClick={() => handleRefreshGraph(graph)} disabled={isRefreshing}>
                    <CachedIcon style={{ color: '#6d6d6d' }} fontSize="small" className={isRefreshing ? 'is-refreshing' : ''} />
                </button>
                <button className="graphbox__more_settings" title="Options" onClick={handleClickShowMoreOptions}>
                    <MoreHorizIcon style={{ color: '#6d6d6d' }} fontSize="small" />
                    {renderMoreOptionsMenu()}
                </button>
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