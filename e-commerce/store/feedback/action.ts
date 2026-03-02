import {
    SUBMIT_FEEDBACK_REQUEST,
    SUBMIT_FEEDBACK_SUCCESS,
    SUBMIT_FEEDBACK_FAILURE,
    FETCH_FEEDBACK_REQUEST,
    FETCH_FEEDBACK_SUCCESS,
    FETCH_FEEDBACK_FAILURE,
    RESET_FEEDBACK_STATUS,
} from "./actionType";

export const submitFeedbackRequest = (payload: {
    order_id: string;
    product_id: string;
    product_name: string;
    user_email: string;
    complaint: string;
}) => ({
    type: SUBMIT_FEEDBACK_REQUEST,
    payload,
});

export const submitFeedbackSuccess = (payload: any) => ({
    type: SUBMIT_FEEDBACK_SUCCESS,
    payload,
});

export const submitFeedbackFailure = (payload: string) => ({
    type: SUBMIT_FEEDBACK_FAILURE,
    payload,
});

export const resetFeedbackStatus = () => ({
    type: RESET_FEEDBACK_STATUS,
});

export const fetchFeedbackRequest = () => ({
    type: FETCH_FEEDBACK_REQUEST,
});

export const fetchFeedbackSuccess = (payload: any[]) => ({
    type: FETCH_FEEDBACK_SUCCESS,
    payload,
});

export const fetchFeedbackFailure = (payload: string) => ({
    type: FETCH_FEEDBACK_FAILURE,
    payload,
});
