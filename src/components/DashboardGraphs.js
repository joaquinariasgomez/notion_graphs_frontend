import { useEffect, useState } from "react";
import { useGlobalStateValue } from "../context/GlobalStateProvider";
import { getGraphs, getMoreGraphs, reorderGraph } from "../api/RequestUtils";
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
import SkeletonGraphBox from "./SkeletonGraphBox";
import DashboardFilters from "./DashboardFilters";
import { actionTypes } from "../context/globalReducer";

export default function DashboardGraphs({ }) {

    // Context
    const [{ userJWTCookie, graphs }, dispatch] = useGlobalStateValue();

    const [graphsLoading, setGraphsLoading] = useState(true);
    const [moreGraphsLoading, setMoreGraphsLoading] = useState(false);
    const [grabbedGraphConfigId, setGrabbedGraphConfigId] = useState(null);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [nextCursor, setNextCursor] = useState(null);
    const [filters, setFilters] = useState({ chartType: null, timeRange: 'NO_TIME' });

    useEffect(() => {
        fetchGraphConfigurations();
    }, []);

    const fetchGraphConfigurations = async (filtersToUse = filters) => {
        try {
            setGraphsLoading(true);
            const apiResponse = await getGraphs(userJWTCookie, filtersToUse);
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

    const loadMoreGraphs = async () => {
        try {
            setMoreGraphsLoading(true);
            const apiResponse = await getMoreGraphs(userJWTCookie, filters, nextCursor);
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
        } catch (error) {

        } finally {
            setMoreGraphsLoading(false);
        }
    }

    const renderLoadMoreGraphsButton = () => {
        if (hasNextPage && !moreGraphsLoading) {
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

    const renderCreateYourFirstGraphPicture = () => {
        return (
            <picture>
                <source
                    media="(max-width: 570px)"
                    srcSet={process.env.PUBLIC_URL + '/create_your_first_chart_short.png'}
                />
                <img
                    src={process.env.PUBLIC_URL + '/create_your_first_chart.png'}
                    alt=""
                    className="create-your-first-chart"
                />
            </picture>
        );
    }

    const renderYourSettingsAreHerePicture = () => {
        return (
            <img
                src={process.env.PUBLIC_URL + '/your_settings_are_here.png'}
                alt=""
                className="your-settings-are-here"
            />
        );
    }

    const grabbedGraph = grabbedGraphConfigId ? graphs.find(g => g.graphConfiguration.id === grabbedGraphConfigId) : null;

    const handleFiltersChange = (newFilters) => {
        setFilters(newFilters);
        fetchGraphConfigurations(newFilters);
    };

    return (
        <div className="dashboard__graphs">
            <DashboardFilters onFiltersChange={handleFiltersChange} />
            {graphsLoading && (
                <div className="graphsgrid">
                    {[...Array(6)].map((_, index) => (
                        <SkeletonGraphBox key={`skeleton-${index}`} />
                    ))}
                </div>
            )}
            {!graphsLoading && graphs.length === 0 && (
                <div className="empty-state-images">
                    {renderCreateYourFirstGraphPicture()}
                    {renderYourSettingsAreHerePicture()}
                </div>
            )}
            {!graphsLoading && graphs.length > 0 && (
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
                        {moreGraphsLoading && (
                            <>
                                {[...Array(3)].map((_, index) => (
                                    <SkeletonGraphBox key={`skeleton-more-${index}`} />
                                ))}
                            </>
                        )}
                        {renderLoadMoreGraphsButton()}
                    </div>
                    <DragOverlay>
                        {grabbedGraph ? (
                            <GraphBox graph={grabbedGraph} />
                        ) : null}
                    </DragOverlay>
                </DndContext>
            )}
        </div>
    );
}