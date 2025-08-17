import { useEffect, useState } from "react";
import { useGlobalStateValue } from "../context/GlobalStateProvider";
import { getGraphConfigurations } from "../api/RequestUtils";
import {
    DndContext,
    closestCenter,
    DragOverlay,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    rectSortingStrategy, // A good strategy for grids
} from "@dnd-kit/sortable";
import GraphBox from "./GraphBox";

export default function DashboardGraphs({ }) {

    // Context
    const [{ userJWTCookie }, dispatch] = useGlobalStateValue();

    const [graphConfigurationsLoading, setGraphConfigurationsLoading] = useState(false);
    const [graphConfigurations, setGraphConfigurations] = useState([]);
    const [grabbedGraphConfigId, setGrabbedGraphConfigId] = useState(null);

    useEffect(() => {
        fetchGraphConfigurations();
    }, []);

    const fetchGraphConfigurations = async () => {
        try {
            setGraphConfigurationsLoading(true);
            const apiResponse = await getGraphConfigurations(userJWTCookie);
            if (apiResponse) {
                setGraphConfigurations(apiResponse);
            }
        } catch (error) {

        } finally {
            setGraphConfigurationsLoading(false);
        }
    }

    const handleDragStart = (event) => {
        setGrabbedGraphConfigId(event.active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setGraphConfigurations((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex); // Utility from dnd-kit
            });
        }
        setGrabbedGraphConfigId(null);
    };

    const grabbedGraph = grabbedGraphConfigId ? graphConfigurations.find(g => g.id === grabbedGraphConfigId) : null;

    return (
        <div>
            <DndContext
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="graphsgrid">
                    <SortableContext
                        items={graphConfigurations.map(g => g.id)}
                        strategy={rectSortingStrategy}
                    >
                        {graphConfigurations.map((graph) => (
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