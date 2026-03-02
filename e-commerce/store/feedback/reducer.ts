import {
    SUBMIT_FEEDBACK_REQUEST,
    SUBMIT_FEEDBACK_SUCCESS,
    SUBMIT_FEEDBACK_FAILURE,
    FETCH_FEEDBACK_REQUEST,
    FETCH_FEEDBACK_SUCCESS,
    FETCH_FEEDBACK_FAILURE,
    RESET_FEEDBACK_STATUS,
} from "./actionType";

interface FeedbackState {
    loading: boolean;
    success: boolean;
    error: string | null;
    feedbacks: any[];
}

const initialState: FeedbackState = {
    loading: false,
    success: false,
    error: null,
    feedbacks: [],
};

const feedbackReducer = (state = initialState, action: any): FeedbackState => {
    switch (action.type) {
        case SUBMIT_FEEDBACK_REQUEST:
            return { ...state, loading: true, error: null, success: false };
        case SUBMIT_FEEDBACK_SUCCESS:
            return { ...state, loading: false, success: true, error: null };
        case SUBMIT_FEEDBACK_FAILURE:
            return { ...state, loading: false, success: false, error: action.payload };
        case FETCH_FEEDBACK_REQUEST:
            return { ...state, loading: true, error: null };
        case FETCH_FEEDBACK_SUCCESS:
            return { ...state, loading: false, feedbacks: action.payload, error: null };
        case FETCH_FEEDBACK_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case RESET_FEEDBACK_STATUS:
            return { ...state, success: false, error: null };
        default:
            return state;
    }
};

export default feedbackReducer;
