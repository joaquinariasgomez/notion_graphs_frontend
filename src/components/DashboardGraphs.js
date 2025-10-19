import { useEffect, useState } from "react";
import { useGlobalStateValue } from "../context/GlobalStateProvider";
import { checkIntegrationConnection, getGraphConfigurations, getGraphs, getMoreGraphs, refreshIntegrationConnection, reorderGraph } from "../api/RequestUtils";
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
    const [moreGraphsLoading, setMoreGraphsLoading] = useState(false);
    const [grabbedGraphConfigId, setGrabbedGraphConfigId] = useState(null);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [nextCursor, setNextCursor] = useState(null);

    useEffect(() => {
        fetchGraphConfigurations();
        fetchIntegrationConnection();
    }, []);

    const showHowToConnectToIntegrationBox = () => {
        dispatch({
            type: actionTypes.SET_SHOW_HOW_TO_CONNECT_TO_INTEGRATION_BOX,
            value: true
        })
    }

    const fetchGraphConfigurations = async () => {
        try {
            setGraphsLoading(true);
            const apiResponse = await getGraphs(userJWTCookie);
            if (apiResponse) {
                dispatch({
                    type: actionTypes.SET_GRAPHS,
                    value: apiResponse.data
                })
                setHasNextPage(apiResponse.hasNextPage)
                setNextCursor(apiResponse.nextCursor)
            }
        } catch (error) {

        } finally {
            setGraphsLoading(false);
        }
    }

    const fetchIntegrationConnection = async () => {
        try {
            const apiResponse = await checkIntegrationConnection(userJWTCookie);
            if (apiResponse && apiResponse.hasTemplateConnectedToIntegration === false) {
                showHowToConnectToIntegrationBox();
            }
        } catch (error) {

        } finally {

        }
    }

    const loadMoreGraphs = async () => {
        try {
            setMoreGraphsLoading(true);
            const apiResponse = await getMoreGraphs(userJWTCookie, nextCursor);
            if (apiResponse) {
                // This logic removes the already present graphs that might have been created before hitting 
                // the "load more" button
                const existingGraphIds = new Set(graphs.map(graph => graph.graphConfiguration.id));
                const uniqueNewGraphs = apiResponse.data.filter(
                    (newGraph) => !existingGraphIds.has(newGraph.graphConfiguration.id)
                );
                // There is a bug which is that backend can still tell us that we have a nextPage to render,
                // and it is an item that is existing in the dashboard
                dispatch({
                    type: actionTypes.APPEND_GRAPHS,
                    value: uniqueNewGraphs
                })
                setHasNextPage(apiResponse.hasNextPage)
                setNextCursor(apiResponse.nextCursor)
            }

            // TODO JOAQUIN: DELETE
            // const apiResponse2 = await refreshIntegrationConnection(userJWTCookie);
        } catch (error) {

        } finally {
            setMoreGraphsLoading(false);
        }
    }

    const renderLoadMoreGraphsButton = () => {
        if (hasNextPage) {
            return (
                <div className='dashboard__graphs__loadmore'>
                    <button onClick={loadMoreGraphs}>
                        <p>Load more</p>
                    </button>
                </div>
            );
        }
    }

    const handleDragStart = (event) => {
        setGrabbedGraphConfigId(event.active.id);
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = graphs.findIndex((item) => item.graphConfiguration.id === active.id);
            const newIndex = graphs.findIndex((item) => item.graphConfiguration.id === over.id);
            const reorderedGraphs = arrayMove(graphs, oldIndex, newIndex);

            dispatch({
                type: actionTypes.SET_GRAPHS,
                value: reorderedGraphs
            });
            try {
                const reorderRequest = JSON.stringify(
                    {
                        "graphConfigurationId": active.id,
                        "newIndex": newIndex
                    }
                );
                await reorderGraph(userJWTCookie, reorderRequest);
            } catch (error) {

            } finally {

            }
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
                    {renderLoadMoreGraphsButton()}
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