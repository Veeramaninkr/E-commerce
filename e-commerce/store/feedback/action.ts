import {
    SUBMIT_FEEDBACK_REQUEST,
    SUBMIT_FEEDBACK_SUCCESS,
    SUBMIT_FEEDBACK_FAILURE,
    FETCH_FEEDBACK_REQUEST,
    FETCH_FEEDBACK_SUCCESS,
    FETCH_FEEDBACK_FAILURE,
    FETCH_MY_FEEDBACK_REQUEST,
    FETCH_MY_FEEDBACK_SUCCESS,
    FETCH_MY_FEEDBACK_FAILURE,
    UPDATE_FEEDBACK_STATUS_REQUEST,
    UPDATE_FEEDBACK_STATUS_SUCCESS,
    UPDATE_FEEDBACK_STATUS_FAILURE,
    RESET_FEEDBACK_STATUS,
} from "./actionType";

export interface Feedback {
    _id?: string;
    id?: string;
    order_id: string;
    product_id: string;
    product_name: string;
    product_image?: string;
    user_email: string;
    complaint: string;
    status: string;
    createdAt?: string;
}

export const submitFeedbackRequest = (payload: Omit<Feedback, 'status'> & { status?: string }) => ({
    type: SUBMIT_FEEDBACK_REQUEST,
    payload,
});

export const submitFeedbackSuccess = (payload: Feedback) => ({
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

export const fetchFeedbackSuccess = (payload: Feedback[]) => ({
    type: FETCH_FEEDBACK_SUCCESS,
    payload,
});

export const fetchFeedbackFailure = (payload: string) => ({
    type: FETCH_FEEDBACK_FAILURE,
    payload,
});

export const updateFeedbackStatusRequest = (feedback_id: string, status: string) => ({
    type: UPDATE_FEEDBACK_STATUS_REQUEST,
    payload: { feedback_id, status },
});

export const updateFeedbackStatusSuccess = (payload: any) => ({
    type: UPDATE_FEEDBACK_STATUS_SUCCESS,
    payload,
});

export const updateFeedbackStatusFailure = (payload: string) => ({
    type: UPDATE_FEEDBACK_STATUS_FAILURE,
    payload,
});

export const fetchMyFeedbackRequest = () => ({
    type: FETCH_MY_FEEDBACK_REQUEST,
});

export const fetchMyFeedbackSuccess = (payload: any[]) => ({
    type: FETCH_MY_FEEDBACK_SUCCESS,
    payload,
});

export const fetchMyFeedbackFailure = (payload: string) => ({
    type: FETCH_MY_FEEDBACK_FAILURE,
    payload,
});
