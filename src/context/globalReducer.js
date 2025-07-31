export const initialState = {
  userJWTCookie: "",
  userSessionDetails: {},
  showCreateGraphBox: false,
  showUserProfileBox: false
}

export const actionTypes = {
  SET_USER_JWT_COOKIE: "SET_USER_JWT_COOKIE",
  SET_USER_SESSION_DETAILS: "SET_USER_SESSION_DETAILS",
  SET_SHOW_CREATE_GRAPH_BOX: "SET_SHOW_CREATE_GRAPH_BOX",
  SET_SHOW_USER_PROFILE_BOX: "SET_SHOW_USER_PROFILE_BOX"
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

    default:
      return state;
  }
}

export default globalReducer;