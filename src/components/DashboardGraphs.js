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
import { actionTypes } from "../context/globalReducer";

export default function DashboardGraphs({ }) {

    // Context
    const [{ userJWTCookie, graphs }, dispatch] = useGlobalStateValue();

    const [graphsLoading, setGraphsLoading] = useState(false);
    const [grabbedGraphConfigId, setGrabbedGraphConfigId] = useState(null);

    useEffect(() => {
        fetchGraphConfigurations();
    }, []);

    const fetchGraphConfigurations = async () => {
        try {
            setGraphsLoading(true);
            const apiResponse = await getGraphs(userJWTCookie);
            if (apiResponse) {
                dispatch({
                    type: actionTypes.SET_GRAPHS,
                    value: apiResponse.data
                })
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
            const oldIndex = graphs.findIndex((item) => item.graphConfiguration.id === active.id);
            const newIndex = graphs.findIndex((item) => item.graphConfiguration.id === over.id);
            const reorderedGraphs = arrayMove(graphs, oldIndex, newIndex);

            dispatch({
                type: actionTypes.SET_GRAPHS,
                value: reorderedGraphs
            });
        }
        setGrabbedGraphConfigId(null);
    };

    const grabbedGraph = grabbedGraphConfigId ? graphs.find(g => g.graphConfiguration.id === grabbedGraphConfigId) : null;

    return (
        <div className="dashboard__graphs">
            <DndContext
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="graphsgrid">
                    <SortableContext
                        items={graphs.map(g => g.graphConfiguration.id)}
                        strategy={rectSortingStrategy}
                    >
                        {graphs.map((graph) => (
                            <GraphBox key={graph.graphConfiguration.id} graph={graph} />
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