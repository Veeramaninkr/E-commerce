import {
    CREATE_COLLECTION_REQUEST,
    CREATE_COLLECTION_SUCCESS,
    CREATE_COLLECTION_FAILURE,
    FETCH_COLLECTIONS_REQUEST,
    FETCH_COLLECTIONS_SUCCESS,
    FETCH_COLLECTIONS_FAILURE,
    ADD_TO_WISHLIST_REQUEST,
    ADD_TO_WISHLIST_SUCCESS,
    ADD_TO_WISHLIST_FAILURE,
    FETCH_WISHLIST_REQUEST,
    FETCH_WISHLIST_SUCCESS,
    FETCH_WISHLIST_FAILURE,
    REMOVE_FROM_WISHLIST_REQUEST,
    REMOVE_FROM_WISHLIST_SUCCESS,
    REMOVE_FROM_WISHLIST_FAILURE,
} from './action';

export interface WishlistState {
    collections: any[];
    wishlist: any[];
    loading: boolean;
    error: string | null;
}

const initialState: WishlistState = {
    collections: [],
    wishlist: [],
    loading: false,
    error: null,
};

const wishlistReducer = (state = initialState, action: any): WishlistState => {
    switch (action.type) {
        case CREATE_COLLECTION_REQUEST:
        case FETCH_COLLECTIONS_REQUEST:
        case ADD_TO_WISHLIST_REQUEST:
        case FETCH_WISHLIST_REQUEST:
        case REMOVE_FROM_WISHLIST_REQUEST:
            return { ...state, loading: true, error: null };

        case CREATE_COLLECTION_SUCCESS:
            return {
                ...state,
                loading: false,
                collections: [...state.collections, action.payload],
            };

        case FETCH_COLLECTIONS_SUCCESS:
            return { ...state, loading: false, collections: action.payload };

        case ADD_TO_WISHLIST_SUCCESS:
            return {
                ...state,
                loading: false,
                wishlist: [...state.wishlist.filter(item => item.product_id !== action.payload.product_id), action.payload],
            };

        case FETCH_WISHLIST_SUCCESS:
            return { ...state, loading: false, wishlist: action.payload };

        case REMOVE_FROM_WISHLIST_SUCCESS:
            return {
                ...state,
                loading: false,
                wishlist: state.wishlist.filter(item => item._id !== action.payload),
            };

        case CREATE_COLLECTION_FAILURE:
        case FETCH_COLLECTIONS_FAILURE:
        case ADD_TO_WISHLIST_FAILURE:
        case FETCH_WISHLIST_FAILURE:
        case REMOVE_FROM_WISHLIST_FAILURE:
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};

export default wishlistReducer;
