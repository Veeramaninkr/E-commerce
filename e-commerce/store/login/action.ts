import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
  LOGOUT_REQUEST,
  CLEAR_AUTH,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,
  GET_ME_REQUEST,
  GET_ME_SUCCESS,
  GET_ME_FAILURE,
  GET_USERS_REQUEST,
  GET_USERS_SUCCESS,
  GET_USERS_FAILURE,
  UPDATE_USER_ROLE_REQUEST,
  UPDATE_USER_ROLE_SUCCESS,
  UPDATE_USER_ROLE_FAILURE,
} from "./actionType";

export const loginRequest = (payload?: any) => ({
  type: LOGIN_REQUEST,
  payload,
});
export const clearAuth = () => ({
  type: CLEAR_AUTH,
});
export const loginSuccess = (payload: any) => ({
  type: LOGIN_SUCCESS,
  payload,
});

export const loginFailure = (payload: any) => ({
  type: LOGIN_FAILURE,
  payload,
});

export const signupRequest = (payload?: any) => ({
  type: SIGNUP_REQUEST,
  payload,
});

export const signupSuccess = (payload: any) => ({
  type: SIGNUP_SUCCESS,
  payload,
});

export const signupFailure = (payload: any) => ({
  type: SIGNUP_FAILURE,
  payload,
});

export const logoutRequest = () => ({
  type: LOGOUT_REQUEST,
});

export const logoutSuccess = () => ({
  type: LOGOUT_SUCCESS,
});

export const logoutFailure = (payload: any) => ({
  type: LOGOUT_FAILURE,
  payload,
});

export const getMeRequest = () => ({
  type: GET_ME_REQUEST,
});

export const getMeSuccess = (payload: any) => ({
  type: GET_ME_SUCCESS,
  payload,
});

export const getMeFailure = (payload: any) => ({
  type: GET_ME_FAILURE,
  payload,
});

export const getUsersRequest = () => ({
  type: GET_USERS_REQUEST,
});

export const getUsersSuccess = (payload: any) => ({
  type: GET_USERS_SUCCESS,
  payload,
});

export const getUsersFailure = (payload: any) => ({
  type: GET_USERS_FAILURE,
  payload,
});

export const updateUserRoleRequest = (payload: { userId: string, role: string }) => ({
  type: UPDATE_USER_ROLE_REQUEST,
  payload,
});

export const updateUserRoleSuccess = (payload: any) => ({
  type: UPDATE_USER_ROLE_SUCCESS,
  payload,
});

export const updateUserRoleFailure = (payload: any) => ({
  type: UPDATE_USER_ROLE_FAILURE,
  payload,
});
