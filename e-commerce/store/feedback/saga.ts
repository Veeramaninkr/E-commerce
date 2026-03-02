import { put, call, takeEvery } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import { SUBMIT_FEEDBACK_REQUEST, FETCH_FEEDBACK_REQUEST } from "./actionType";
import { submitFeedbackSuccess, submitFeedbackFailure, fetchFeedbackSuccess, fetchFeedbackFailure } from "./action";
import api from "../api";

function feedbackApi(payload: any) {
    return api.post("/feedback", payload);
}

function fetchFeedbackApi() {
    return api.get("/feedback");
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

export function* feedbackSaga(): SagaIterator {
    yield takeEvery(SUBMIT_FEEDBACK_REQUEST, submitFeedbackSaga);
    yield takeEvery(FETCH_FEEDBACK_REQUEST, fetchFeedbackSaga);
}
