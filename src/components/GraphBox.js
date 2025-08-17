import { useSortable } from "@dnd-kit/sortable";

export default function GraphBox({ graph }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: graph.id }); // Use a unique ID from my data

    const style = {
        transform,
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="graphbox"
        >
            <h4>{graph.id || 'Untitled Graph'}</h4>
            <p>Type: {graph.graphType || 'N/A'}</p>
        </div>
    );
}