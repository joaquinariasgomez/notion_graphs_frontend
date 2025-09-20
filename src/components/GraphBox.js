import { useSortable } from "@dnd-kit/sortable";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import DeleteIcon from '@mui/icons-material/Delete';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import { useEffect, useState } from "react";
import GraphDisplayer from "./graphsdisplay/GraphDisplayer";
import SyncLoader from "react-spinners/SyncLoader";
import { getGraphTitleFromConfiguration } from "./graphsdisplay/GraphsDisplayUtils";
import { useGlobalStateValue } from "../context/GlobalStateProvider";
import { actionTypes } from "../context/globalReducer";
import { deleteGraph } from "../api/RequestUtils";
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

    const [isMoreSettingsOpen, setIsMoreSettingsOpen] = useState(false);

    useEffect(() => {
        console.log(graph);
    }, [graph]);

    const handleClickMoreSettingsButton = () => {
        console.log("Executing");
        setIsMoreSettingsOpen(!isMoreSettingsOpen);
    }

    const handleClickUpdateGraphConfiguration = (graph) => {
        dispatch({
            type: actionTypes.SET_SHOW_UPDATE_GRAPH_CONFIGURATION_BOX,
            value: true
        })
        console.log("Setting ", graph.graphConfiguration)
        dispatch({
            type: actionTypes.SET_EDITING_GRAPH_CONFIGURATION,
            value: graph.graphConfiguration
        })
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

    const renderGraph = (graph) => {
        const graphCreationStatus = graph.graphConfiguration.graphCreationStatus;
        switch (graphCreationStatus) {
            case "CREATED":
                return (
                    <GraphDisplayer graphConfiguration={graph.graphConfiguration} graphData={graph.graphData} />
                );
            default:
            case "PENDING":
                return (
                    <div className="loading">
                        <p className="title">
                            {getGraphTitleFromConfiguration(graph.graphConfiguration)}
                        </p>
                        <SyncLoader size={14} style={{ color: '#6d6d6d' }} />
                    </div>
                );
            case "ERROR":
                {/* TODO JOAQUIN - fill */ }
                return (<></>);
        }
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            className="graphbox"
        >
            <div {...listeners} className="graphbox__drag-handle">
                <DragIndicatorIcon sx={{ cursor: 'grab' }} />
            </div>
            <div className="graphbox__header">
                <div className="graphbox__updatedAt" title="Last graph update">
                    <p>{getRelativeTimeFromTimestamp(graph.updatedAt)}</p>
                </div>
                <button className="graphbox__updateconfig" title="Update configuration" onClick={() => handleClickUpdateGraphConfiguration(graph)}>
                    <TuneRoundedIcon style={{ color: '#6d6d6d' }} fontSize="small" />
                </button>
                <button className="graphbox__delete" title="Delete" onClick={() => handleDeleteGraph(graph)}>
                    <DeleteIcon style={{ color: '#f14668' }} fontSize="small" />
                </button>
                {/* TODO put more options in this array */}
            </div>
            <div className="graphbox__graph">
                {renderGraph(graph)}
            </div>
        </div >
    );
}