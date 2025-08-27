import { useEffect, useState } from "react";
import { useGlobalStateValue } from "../context/GlobalStateProvider";
import { getGraphConfigurations, getGraphs } from "../api/RequestUtils";
import {
    DndContext,
    closestCenter,
    DragOverlay,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    rectSortingStrategy,
} from "@dnd-kit/sortable";
import GraphBox from "./GraphBox";

export default function DashboardGraphs({ }) {

    // Context
    const [{ userJWTCookie }, dispatch] = useGlobalStateValue();

    const [graphsLoading, setGraphsLoading] = useState(false);
    const [graphs, setGraphs] = useState([]);
    const [grabbedGraphConfigId, setGrabbedGraphConfigId] = useState(null);

    useEffect(() => {
        fetchGraphConfigurations();
    }, []);

    const fetchGraphConfigurations = async () => {
        try {
            setGraphsLoading(true);
            const apiResponse = await getGraphs(userJWTCookie);
            if (apiResponse) {
                setGraphs(apiResponse);
            }
        } catch (error) {

        } finally {
            setGraphsLoading(false);
        }
    }

    const handleDragStart = (event) => {
        setGrabbedGraphConfigId(event.active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setGraphs((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex); // Utility from dnd-kit
            });
        }
        setGrabbedGraphConfigId(null);
    };

    const grabbedGraph = grabbedGraphConfigId ? graphs.find(g => g.id === grabbedGraphConfigId) : null;

    return (
        <div className="dashboard__graphs">
            {/* TODO: optimizar esto para que sea una opcion dentro del GraphBox */}
            <DndContext
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="graphsgrid">
                    <SortableContext
                        items={graphs.map(g => g.id)}
                        strategy={rectSortingStrategy}
                    >
                        {graphs.map((graph) => (
                            <GraphBox key={graph.id} graph={graph} />
                        ))}
                    </SortableContext>
                </div>

                <DragOverlay>
                    {grabbedGraph ? (
                        <GraphBox graph={grabbedGraph} />
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}