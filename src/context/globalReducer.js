export const initialState = {
  userJWTCookie: "",
  userSessionDetails: {},
  setShowCreateGraphBox: false
}

export const actionTypes = {
  SET_USER_JWT_COOKIE: "SET_USER_JWT_COOKIE",
  SET_USER_SESSION_DETAILS: "SET_USER_SESSION_DETAILS",
  SET_SHOW_CREATE_GRAPH_BOX: "SET_SHOW_CREATE_GRAPH_BOX"
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
        setShowCreateGraphBox: action.value
      };

    default:
      return state;
  }
}

export default globalReducer;