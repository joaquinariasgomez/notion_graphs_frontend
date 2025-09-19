export const initialState = {
  userJWTCookie: "",
  userSessionDetails: {},
  showCreateGraphBox: false,
  showUpdateGraphConfigurationBox: false,
  showUserProfileBox: false,
  graphs: [],
  editingGraphConfiguration: {} // Data for when customer edits a graph's configuration
}

export const actionTypes = {
  SET_USER_JWT_COOKIE: "SET_USER_JWT_COOKIE",
  SET_USER_SESSION_DETAILS: "SET_USER_SESSION_DETAILS",
  SET_SHOW_CREATE_GRAPH_BOX: "SET_SHOW_CREATE_GRAPH_BOX",
  SET_SHOW_UPDATE_GRAPH_CONFIGURATION_BOX: "SET_SHOW_UPDATE_GRAPH_CONFIGURATION_BOX",
  SET_SHOW_USER_PROFILE_BOX: "SET_SHOW_USER_PROFILE_BOX",
  SET_GRAPHS: "SET_GRAPHS",
  APPEND_GRAPH: "APPEND_GRAPH",
  APPEND_GRAPHS: "APPEND_GRAPHS",
  UPDATE_GRAPH: "UPDATE_GRAPH",
  DELETE_GRAPH: "DELETE_GRAPH",
  SET_EDITING_GRAPH_CONFIGURATION: "SET_EDITING_GRAPH_CONFIGURATION"
}

const globalReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_USER_JWT_COOKIE:
      return {
        ...state,
        userJWTCookie: action.value
      };

    case actionTypes.SET_USER_SESSION_DETAILS:
      return {
        ...state,
        userSessionDetails: action.value
      };

    case actionTypes.SET_SHOW_CREATE_GRAPH_BOX:
      return {
        ...state,
        showCreateGraphBox: action.value
      };

    case actionTypes.SET_SHOW_UPDATE_GRAPH_CONFIGURATION_BOX:
      return {
        ...state,
        showUpdateGraphConfigurationBox: action.value
      };

    case actionTypes.SET_SHOW_USER_PROFILE_BOX:
      return {
        ...state,
        showUserProfileBox: action.value
      };

    case actionTypes.SET_GRAPHS:
      return {
        ...state,
        graphs: action.value
      };

    case actionTypes.APPEND_GRAPH:
      return {
        ...state,
        graphs: [...state.graphs, action.value]
      };

    case actionTypes.APPEND_GRAPHS:
      return {
        ...state,
        graphs: [...state.graphs, ...action.value]
      };

    case actionTypes.UPDATE_GRAPH:
      // Updates the element with id "id" by "data"
      const { id, data } = action.payload;
      const updatedGraphs = state.graphs.map((graph) => {
        if (graph.graphConfiguration.id === id) {
          return data;
        }
        return graph;
      });

      return {
        ...state,
        graphs: updatedGraphs
      };

    case actionTypes.DELETE_GRAPH:
      // Updates the element with id "id" by "data"
      const idToDelete = action.value;
      const filteredGraphs = state.graphs.filter((graph) => graph.graphConfiguration.id !== idToDelete);

      return {
        ...state,
        graphs: filteredGraphs
      };

    case actionTypes.SET_EDITING_GRAPH_CONFIGURATION:
      return {
        ...state,
        editingGraphConfiguration: action.value
      };

    default:
      return state;
  }
}

export default globalReducer;