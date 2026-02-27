import { takeLatest, put, call, takeEvery } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import {
  LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE,
  SIGNUP_REQUEST, SIGNUP_SUCCESS, SIGNUP_FAILURE,
  LOGOUT_REQUEST, LOGOUT_SUCCESS, LOGOUT_FAILURE,
  GET_ME_REQUEST, GET_ME_SUCCESS, GET_ME_FAILURE,
  GET_USERS_REQUEST, GET_USERS_SUCCESS, GET_USERS_FAILURE,
  UPDATE_USER_ROLE_REQUEST, UPDATE_USER_ROLE_SUCCESS, UPDATE_USER_ROLE_FAILURE,
  CLEAR_AUTH,
} from "./actionType";
import {
  loginSuccess,
  loginFailure,
  signupSuccess,
  signupFailure,
  logoutSuccess,
  logoutFailure,
  getMeSuccess,
  getMeFailure,
  getUsersRequest,
  getUsersSuccess,
  getUsersFailure,
  updateUserRoleSuccess,
  updateUserRoleFailure,
} from "./action";

import api from "../api";

function loginApi(payload: any) {
  return api.post("/login", payload);
}

function signupApi(payload: any) {
  return api.post("/register", payload);
}

function fetchApi() {
  return api.get("/login");
}

function logoutApi() {
  return api.post("/logout");
}

function getMeApi() {
  return api.get("/me");
}

function getUsersApi() {
  return api.get("/users");
}

function updateUserRoleApi(userId: string, role: string) {
  return api.patch(`/users/${userId}/role`, { role });
}

function* loginRequestSaga(action: any): SagaIterator {
  try {
    const response = yield call(loginApi, action.payload);
    // After login, fetch the actual user data to get the role
    const userResponse = yield call(getMeApi);
    yield put(loginSuccess(userResponse.data));
  } catch (error: any) {
    yield put(loginFailure(error.response?.data?.detail || error.message));
  }
}

function* signupRequestSaga(action: any): SagaIterator {
  try {
    const response = yield call(signupApi, action.payload);
    yield put(signupSuccess(response.data));
  } catch (error: any) {
    yield put(signupFailure(error.response?.data?.detail || error.message));
  }
}

function* logoutRequestSaga(): SagaIterator {
  try {
    yield call(logoutApi);
    yield put(logoutSuccess());
  } catch (error: any) {
    yield put(logoutFailure(error.response?.data?.detail || error.message));
    // If the API call fails, we still want to clear the local state to allow the user to try again
    yield put(logoutSuccess());
  }
}

function* getMeRequestSaga(): SagaIterator {
  try {
    const response = yield call(getMeApi);
    yield put(getMeSuccess(response.data));
  } catch (error: any) {
    yield put(getMeFailure(error.response?.data?.detail || error.message));
  }
}

function* getUsersRequestSaga(): SagaIterator {
  try {
    const response = yield call(getUsersApi);
    yield put(getUsersSuccess(response.data));
  } catch (error: any) {
    yield put(getUsersFailure(error.response?.data?.detail || error.message));
  }
}

function* updateUserRoleRequestSaga(action: any): SagaIterator {
  try {
    const { userId, role } = action.payload;
    const response = yield call(updateUserRoleApi, userId, role);
    yield put(updateUserRoleSuccess(response.data));
    // Refresh user list to ensure UI is in sync
    yield put(getUsersRequest());
  } catch (error: any) {
    yield put(updateUserRoleFailure(error.response?.data?.detail || error.message));
  }
}


export function* authSaga(): SagaIterator {
  yield takeEvery(SIGNUP_REQUEST, signupRequestSaga);
  yield takeEvery(LOGIN_REQUEST, loginRequestSaga);
  yield takeEvery(LOGOUT_REQUEST, logoutRequestSaga);
  yield takeEvery(GET_ME_REQUEST, getMeRequestSaga);
  yield takeEvery(GET_USERS_REQUEST, getUsersRequestSaga);
  yield takeEvery(UPDATE_USER_ROLE_REQUEST, updateUserRoleRequestSaga);
}
