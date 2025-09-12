export const initialState = {
  userJWTCookie: "",
  userSessionDetails: {},
  showCreateGraphBox: false,
  showUserProfileBox: false,
  graphs: []
}

export const actionTypes = {
  SET_USER_JWT_COOKIE: "SET_USER_JWT_COOKIE",
  SET_USER_SESSION_DETAILS: "SET_USER_SESSION_DETAILS",
  SET_SHOW_CREATE_GRAPH_BOX: "SET_SHOW_CREATE_GRAPH_BOX",
  SET_SHOW_USER_PROFILE_BOX: "SET_SHOW_USER_PROFILE_BOX",
  SET_GRAPHS: "SET_GRAPHS",
  APPEND_GRAPH: "APPEND_GRAPH",
  UPDATE_GRAPH: "UPDATE_GRAPH"
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

    default:
      return state;
  }
}

export default globalReducer;