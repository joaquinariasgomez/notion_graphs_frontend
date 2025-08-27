import { useSortable } from "@dnd-kit/sortable";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useEffect, useState } from "react";

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
        transform,
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
            {...listeners}
            className="graphbox"
        >
            <div className="graphbox__moresettings__container">
                <button onClick={() => handleClickMoreSettingsButton()}>
                    <MoreHorizIcon sx={{ color: "#28282B" }} fontSize="medium" />
                </button>
                {isMoreSettingsOpen && renderMoreSettings()}
            </div>
            <div className="graphbox__settings">

            </div>
            <div className="graphbox__graph">
                <h4>{graph.graphConfiguration.id || 'Untitled Graph'}</h4>
            </div>
        </div>
    );
}