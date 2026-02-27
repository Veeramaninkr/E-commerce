import { put, call, takeEvery } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import {
  ADD_REQUEST, ADD_SUCCESS, ADD_FAILURE,
  REMOVE_REQUEST, REMOVE_SUCCESS, REMOVE_FAILURE,
  UPDATE_REQUEST, UPDATE_SUCCESS, UPDATE_FAILURE,
  GET_REQUEST, GET_SUCCESS, GET_FAILURE,
} from "./actionType";
import {
  addSuccess,
  addFailure,
  removeSuccess,
  removeFailure,
  updateSuccess,
  updateFailure,
  getSuccess,
  getFailure,
} from "./action";
import api from "../api";

function addApi(payload: any) {
  return api.post("/products", payload);
}

function removeApi(payload: any) {
  return api.delete(`/products/${payload}`);
}
function updateApi(payload: any) {
  return api.patch(`/products/${payload.id || payload._id}`, payload);
}
function getApi(payload: any) {
  return api.get(`/products/${payload}`);
}

function* addRequestSaga(action: any): SagaIterator {
  try {
    const response = yield call(addApi, action.payload);
    yield put(addSuccess(response.data));
  } catch (error: any) {
    const errorMsg = error.response?.data?.detail || error.message;
    yield put(addFailure(errorMsg));
  }
}

function* removeRequestSaga(action: any): SagaIterator {
  try {
    yield call(removeApi, action.payload);
    yield put(removeSuccess(action.payload)); // Pass the ID to the success action
  } catch (error: any) {
    const errorMsg = error.response?.data?.detail || error.message;
    yield put(removeFailure(errorMsg));
  }
}

function* updateRequestSaga(action: any): SagaIterator {
  try {
    const response = yield call(updateApi, action.payload);
    yield put(updateSuccess(response.data));
  } catch (error: any) {
    yield put(updateFailure(error.message));
  }
}
function* getRequestSaga(action: any): SagaIterator {
  try {
    const response = yield call(getApi, action.payload);
    yield put(getSuccess(response.data));
  } catch (error: any) {
    yield put(getFailure(error.message));
  }
}

export function* addProSaga(): SagaIterator {
  yield takeEvery(ADD_REQUEST, addRequestSaga);
  yield takeEvery(REMOVE_REQUEST, removeRequestSaga);
  yield takeEvery(UPDATE_REQUEST, updateRequestSaga);
  yield takeEvery(GET_REQUEST, getRequestSaga);
}
