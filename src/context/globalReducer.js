// Helper function to read cookie synchronously
const getCookieValue = (cookieName) => {
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${cookieName}=`));
  return cookie ? cookie.split("=")[1] : "";
};

// Helper function to read localStorage synchronously
const getLocalStorageValue = (key) => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : {};
  } catch (error) {
    return {};
  }
};

export const initialState = {
  userJWTCookie: getCookieValue("userJWT"), // Initialize with actual cookie value
  userSessionDetails: getLocalStorageValue("userSessionDetails"), // Initialize with actual localStorage value
  activeBox: null, // null or { type: 'PROFILE' | 'CREATE_GRAPH' | 'UPDATE_GRAPH' | 'BILLING_LIMIT_ERROR' | 'UNKNOWN_ERROR' | 'CLIENT_ERROR', data: {...} }
  templateConnectedToIntegrationData: {},
  billingGraphCountData: null,
  billingPlan: null,
  graphs: [],
  editingGraphConfiguration: {} // Data for when customer edits a graph's configuration
}

export const actionTypes = {
  SET_USER_JWT_COOKIE: "SET_USER_JWT_COOKIE",
  SET_USER_SESSION_DETAILS: "SET_USER_SESSION_DETAILS",
  SET_ACTIVE_BOX: "SET_ACTIVE_BOX",
  CLOSE_ACTIVE_BOX: "CLOSE_ACTIVE_BOX",
  SET_TEMPLATE_CONNECTED_TO_INTEGRATION_DATA: "SET_TEMPLATE_CONNECTED_TO_INTEGRATION_DATA",
  SET_BILLING_GRAPH_COUNT_DATA: "SET_BILLING_GRAPH_COUNT_DATA",
  SET_BILLING_PLAN: "SET_BILLING_PLAN",
  SET_GRAPHS: "SET_GRAPHS",
  APPEND_GRAPH: "APPEND_GRAPH",
  APPEND_GRAPHS: "APPEND_GRAPHS",
  UPDATE_GRAPH: "UPDATE_GRAPH",
  DELETE_GRAPH: "DELETE_GRAPH",
  SET_EDITING_GRAPH_CONFIGURATION: "SET_EDITING_GRAPH_CONFIGURATION"
}

// Box type constants for better type safety and consistency
export const BOX_TYPES = {
  PROFILE: "PROFILE",
  CREATE_GRAPH: "CREATE_GRAPH",
  UPDATE_GRAPH: "UPDATE_GRAPH",
  BILLING_LIMIT_ERROR: "BILLING_LIMIT_ERROR",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
  CLIENT_ERROR: "CLIENT_ERROR"
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

    case actionTypes.SET_ACTIVE_BOX:
      return {
        ...state,
        activeBox: action.value // { type: BOX_TYPES.*, data: {...} }
      };

    case actionTypes.CLOSE_ACTIVE_BOX:
      return {
        ...state,
        activeBox: null
      };

    case actionTypes.SET_TEMPLATE_CONNECTED_TO_INTEGRATION_DATA:
      return {
        ...state,
        templateConnectedToIntegrationData: action.value
      };

    case actionTypes.SET_BILLING_GRAPH_COUNT_DATA:
      return {
        ...state,
        billingGraphCountData: action.value
      };

    case actionTypes.SET_BILLING_PLAN:
      return {
        ...state,
        billingPlan: action.value
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