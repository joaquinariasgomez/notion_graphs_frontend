import { useSortable } from "@dnd-kit/sortable";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from "react";
import GraphDisplayer from "./graphsdisplay/GraphDisplayer";
import SyncLoader from "react-spinners/SyncLoader";
import { getGraphTitleFromConfiguration } from "./graphsdisplay/GraphsDisplayUtils";
import { useGlobalStateValue } from "../context/GlobalStateProvider";
import { actionTypes } from "../context/globalReducer";
import { deleteGraph } from "../api/RequestUtils";

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
        console.log(isMoreSettingsOpen);
    }, [isMoreSettingsOpen]);

    const handleClickMoreSettingsButton = () => {
        console.log("Executing");
        setIsMoreSettingsOpen(!isMoreSettingsOpen);
    }

    const handleDeleteGraph = (graph) => {
        dispatch({
            type: actionTypes.DELETE_GRAPH,
            value: graph.graphConfiguration.id
        })
        try {
            deleteGraph(userJWTCookie, graph.graphConfiguration.id);
        } catch (error) {
            // TODO: think about this
        }
    }

    const renderMoreSettings = () => {
        return (
            <div>
                Hola
            </div>
        );
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
                {/* <div className="graphbox__moresettings__container">
                <button onClick={() => handleClickMoreSettingsButton()}>
                    <MoreHorizIcon sx={{ color: "#28282B" }} fontSize="medium" />
                </button>
                {isMoreSettingsOpen && renderMoreSettings()}
                </div> */}
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