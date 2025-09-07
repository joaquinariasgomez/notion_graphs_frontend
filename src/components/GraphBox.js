import { useSortable } from "@dnd-kit/sortable";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { useEffect, useState } from "react";
import GraphDisplayer from "./graphsdisplay/GraphDisplayer";

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

    const [isMoreSettingsOpen, setIsMoreSettingsOpen] = useState(false);

    useEffect(() => {
        console.log(isMoreSettingsOpen);
    }, [isMoreSettingsOpen]);

    const handleClickMoreSettingsButton = () => {
        console.log("Executing");
        setIsMoreSettingsOpen(!isMoreSettingsOpen);
    }

    const renderMoreSettings = () => {
        return (
            <div>
                Hola
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
                <DragIndicatorIcon sx={{ cursor: 'grab' }} />
            </div>
            <div className="graphbox__header">
                {/* <div className="graphbox__moresettings__container">
                <button onClick={() => handleClickMoreSettingsButton()}>
                    <MoreHorizIcon sx={{ color: "#28282B" }} fontSize="medium" />
                </button>
                {isMoreSettingsOpen && renderMoreSettings()}
                </div> */}
                <div className="graphbox__delete">

                </div>
                {/* TODO put more options in this array */}
            </div>
            <div className="graphbox__graph">
                <GraphDisplayer graphConfiguration={graph.graphConfiguration} graphData={graph.graphData} />
            </div>
        </div>
    );
}