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
import { Feedback } from "./action";

interface FeedbackState {
    loading: boolean;
    updating: boolean;
    success: boolean;
    error: string | null;
    feedbacks: Feedback[];
}

const initialState: FeedbackState = {
    loading: false,
    updating: false,
    success: false,
    error: null,
    feedbacks: [],
};

const feedbackReducer = (state = initialState, action: any): FeedbackState => {
    switch (action.type) {
        case SUBMIT_FEEDBACK_REQUEST:
            return { ...state, loading: true, error: null, success: false };
        case SUBMIT_FEEDBACK_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                error: null,
                feedbacks: [...state.feedbacks, action.payload]
            };
        case SUBMIT_FEEDBACK_FAILURE:
            return { ...state, loading: false, success: false, error: action.payload };

        case FETCH_FEEDBACK_REQUEST:
        case FETCH_MY_FEEDBACK_REQUEST:
            return { ...state, loading: true, error: null };
        case FETCH_FEEDBACK_SUCCESS:
        case FETCH_MY_FEEDBACK_SUCCESS:
            return { ...state, loading: false, feedbacks: action.payload, error: null };
        case FETCH_FEEDBACK_FAILURE:
        case FETCH_MY_FEEDBACK_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case UPDATE_FEEDBACK_STATUS_REQUEST:
            return { ...state, updating: true, error: null };
        case UPDATE_FEEDBACK_STATUS_SUCCESS:
            const updatedId = action.payload._id || action.payload.id;
            return {
                ...state,
                updating: false,
                feedbacks: state.feedbacks.map((f) =>
                    (f._id === updatedId || f.id === updatedId) ? action.payload : f
                ),
                error: null
            };
        case UPDATE_FEEDBACK_STATUS_FAILURE:
            return { ...state, updating: false, error: action.payload };

        case RESET_FEEDBACK_STATUS:
            return { ...state, success: false, error: null };
        default:
            return state;
    }
};

export default feedbackReducer;
