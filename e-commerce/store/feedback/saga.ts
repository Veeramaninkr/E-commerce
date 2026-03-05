import { put, call, takeLatest, takeEvery } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
<<<<<<< Updated upstream
import { SUBMIT_FEEDBACK_REQUEST, FETCH_FEEDBACK_REQUEST, UPDATE_FEEDBACK_STATUS_REQUEST } from "./actionType";
=======
import { SUBMIT_FEEDBACK_REQUEST, FETCH_FEEDBACK_REQUEST, UPDATE_FEEDBACK_STATUS_REQUEST, FETCH_MY_FEEDBACK_REQUEST } from "./actionType";
>>>>>>> Stashed changes
import {
    submitFeedbackSuccess,
    submitFeedbackFailure,
    fetchFeedbackSuccess,
    fetchFeedbackFailure,
    updateFeedbackStatusSuccess,
<<<<<<< Updated upstream
    updateFeedbackStatusFailure
=======
    updateFeedbackStatusFailure,
    fetchMyFeedbackSuccess,
    fetchMyFeedbackFailure
>>>>>>> Stashed changes
} from "./action";
import api from "../api";

function feedbackApi(payload: any) {
    return api.post("/feedback", payload);
}

function fetchFeedbackApi() {
    return api.get("/feedback");
}

<<<<<<< Updated upstream
function updateFeedbackStatusApi(feedbackId: string, status: string) {
    return api.patch(`/feedback/${feedbackId}`, { status });
=======
function fetchMyFeedbackApi() {
    return api.get("/my-feedback");
}

function updateFeedbackStatusApi(id: string, status: string) {
    return api.patch(`/feedback/${id}`, { status });
>>>>>>> Stashed changes
}

function* submitFeedbackSaga(action: any): SagaIterator {
    try {
        const response = yield call(feedbackApi, action.payload);
        yield put(submitFeedbackSuccess(response.data));
    } catch (error: any) {
        const errorMsg = error.response?.data?.detail || error.message || "Feedback submission failed";
        yield put(submitFeedbackFailure(errorMsg));
    }
}

function* fetchFeedbackSaga(): SagaIterator {
    try {
        const response = yield call(fetchFeedbackApi);
        yield put(fetchFeedbackSuccess(response.data));
    } catch (error: any) {
        const errorMsg = error.response?.data?.detail || error.message || "Feedback fetch failed";
        yield put(fetchFeedbackFailure(errorMsg));
    }
}

function* updateFeedbackStatusSaga(action: any): SagaIterator {
    try {
<<<<<<< Updated upstream
        const { feedbackId, status } = action.payload;
        console.log(feedbackId,"feedbackId");
        console.log(status,"status");
        if (!feedbackId) throw new Error("Feedback ID is required");
        const response = yield call(updateFeedbackStatusApi, feedbackId, status);
        yield put(updateFeedbackStatusSuccess(response.data));
        console.log(response.data,"response");
=======
        const { feedback_id, status } = action.payload;
        const response = yield call(updateFeedbackStatusApi, feedback_id, status);
        yield put(updateFeedbackStatusSuccess(response.data));
>>>>>>> Stashed changes
    } catch (error: any) {
        const errorMsg = error.response?.data?.detail || error.message || "Feedback status update failed";
        yield put(updateFeedbackStatusFailure(errorMsg));
    }
}

<<<<<<< Updated upstream
export function* feedbackSaga(): SagaIterator {
    yield takeEvery(SUBMIT_FEEDBACK_REQUEST, submitFeedbackSaga);
    yield takeLatest(FETCH_FEEDBACK_REQUEST, fetchFeedbackSaga);
    yield takeEvery(UPDATE_FEEDBACK_STATUS_REQUEST, updateFeedbackStatusSaga);
=======
function* fetchMyFeedbackSaga(): SagaIterator {
    try {
        const response = yield call(fetchMyFeedbackApi);
        yield put(fetchMyFeedbackSuccess(response.data));
    } catch (error: any) {
        const errorMsg = error.response?.data?.detail || error.message || "Feedback fetch failed";
        yield put(fetchMyFeedbackFailure(errorMsg));
    }
}

export function* feedbackSaga(): SagaIterator {
    yield takeEvery(SUBMIT_FEEDBACK_REQUEST, submitFeedbackSaga);
    yield takeEvery(FETCH_FEEDBACK_REQUEST, fetchFeedbackSaga);
    yield takeEvery(UPDATE_FEEDBACK_STATUS_REQUEST, updateFeedbackStatusSaga);
    yield takeEvery(FETCH_MY_FEEDBACK_REQUEST, fetchMyFeedbackSaga);
>>>>>>> Stashed changes
}
