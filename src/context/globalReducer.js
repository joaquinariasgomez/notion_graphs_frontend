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
  editingGraphConfiguration: {}, // Data for when customer edits a graph's configuration
  upcomingBudgets: [],
  closedBudgets: []
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
  SET_EDITING_GRAPH_CONFIGURATION: "SET_EDITING_GRAPH_CONFIGURATION",
  SET_UPCOMING_BUDGETS: "SET_UPCOMING_BUDGETS",
  SET_CLOSED_BUDGETS: "SET_CLOSED_BUDGETS",
  APPEND_CLOSED_BUDGETS: "APPEND_CLOSED_BUDGETS",
  APPEND_BUDGET: "APPEND_BUDGET",
  UPDATE_BUDGET: "UPDATE_BUDGET",
  DELETE_BUDGET: "DELETE_BUDGET"
}

// Box type constants for better type safety and consistency
export const BOX_TYPES = {
  PROFILE: "PROFILE",
  CREATE_GRAPH: "CREATE_GRAPH",
  UPDATE_GRAPH: "UPDATE_GRAPH",
  UPDATE_BURNDOWN: "UPDATE_BURNDOWN",
  REGISTER_VALUE: "REGISTER_VALUE",
  CREATE_BUDGET: "CREATE_BUDGET",
  VIEW_BUDGET: "VIEW_BUDGET",
  UPDATE_BUDGET: "UPDATE_BUDGET",
  BILLING_LIMIT_ERROR: "BILLING_LIMIT_ERROR",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
  CLIENT_ERROR: "CLIENT_ERROR"
}

function budgetIsClosed(budget) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  return !(budget.year > currentYear || (budget.year === currentYear && budget.month >= currentMonth));
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

    case actionTypes.SET_UPCOMING_BUDGETS:
      return {
        ...state,
        upcomingBudgets: action.value ?? []
      };

    case actionTypes.SET_CLOSED_BUDGETS:
      return {
        ...state,
        closedBudgets: action.value ?? []
      };

    case actionTypes.APPEND_CLOSED_BUDGETS:
      return {
        ...state,
        closedBudgets: [...state.closedBudgets, ...action.value]
      };

    case actionTypes.APPEND_BUDGET: {
      // Route the newly created budget into the correct list based on its date.
      const isClosed = budgetIsClosed(action.value);
      return isClosed
        ? { ...state, closedBudgets: [action.value, ...state.closedBudgets] }
        : { ...state, upcomingBudgets: [action.value, ...state.upcomingBudgets] };
    }

    case actionTypes.UPDATE_BUDGET: {
      // Remove from both lists, then re-insert into the correct one.
      // This handles the case where an edit changes the month and moves the
      // budget between the upcoming and closed sections.
      const { id: budgetId, data: budgetData } = action.payload;
      const filteredUpcoming = state.upcomingBudgets.filter((b) => b.id !== budgetId);
      const filteredClosed = state.closedBudgets.filter((b) => b.id !== budgetId);
      const isClosed = budgetIsClosed(budgetData);

      return isClosed
        ? { ...state, upcomingBudgets: filteredUpcoming, closedBudgets: [budgetData, ...filteredClosed] }
        : { ...state, upcomingBudgets: [budgetData, ...filteredUpcoming], closedBudgets: filteredClosed };
    }

    case actionTypes.DELETE_BUDGET: {
      const budgetIdToDelete = action.value;
      return {
        ...state,
        upcomingBudgets: state.upcomingBudgets.filter((b) => b.id !== budgetIdToDelete),
        closedBudgets: state.closedBudgets.filter((b) => b.id !== budgetIdToDelete),
      };
    }

    default:
      return state;
  }
}

export default globalReducer;