import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,
  GET_ME_REQUEST,
  GET_ME_SUCCESS,
  GET_ME_FAILURE,
  CLEAR_AUTH,
  GET_USERS_REQUEST,
  GET_USERS_SUCCESS,
  GET_USERS_FAILURE,
  UPDATE_USER_ROLE_REQUEST,
  UPDATE_USER_ROLE_SUCCESS,
  UPDATE_USER_ROLE_FAILURE,
} from "./actionType";


interface LoginState {
  loading: boolean;
  error: string | null;
  user: any | null;
  users: any[];
  isAuthenticated: boolean;
  signupSuccess: boolean;
}

const initialState: LoginState = {
  loading: false,
  error: null,
  user: null,
  users: [],
  isAuthenticated: false,
  signupSuccess: false,
};

const loginReducer = (
  state: LoginState = initialState,
  action: any,
): LoginState => {
  switch (action.type) {
    case LOGIN_REQUEST:
    case SIGNUP_REQUEST:
    case LOGOUT_REQUEST:
    case GET_ME_REQUEST:
    case GET_USERS_REQUEST:
    case UPDATE_USER_ROLE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        signupSuccess: false,
      };
    case LOGIN_SUCCESS:
    case GET_ME_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload,
        isAuthenticated: true,
        error: null,
      };
    case GET_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        users: action.payload,
        error: null,
      };
    case UPDATE_USER_ROLE_SUCCESS:
      return {
        ...state,
        loading: false,
        users: state.users.map((u: any) =>
          (u.id === action.payload.id || u._id === action.payload._id) ? action.payload : u
        ),
        error: null,
      };
    case LOGOUT_SUCCESS:
      return {
        ...initialState,
      };
    case SIGNUP_SUCCESS:
      return {
        ...state,
        loading: false,
        signupSuccess: true,
        error: null,
      };
    case CLEAR_AUTH:
      return {
        ...state,
        error: null,
        signupSuccess: false,
        loading: false,
        isAuthenticated: false,
        user: null,

      };
    case LOGIN_FAILURE:
    case SIGNUP_FAILURE:
    case GET_ME_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        isAuthenticated: false,
        user: null,
      };
    case LOGOUT_FAILURE:
    case GET_USERS_FAILURE:
    case UPDATE_USER_ROLE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};


export default loginReducer;
