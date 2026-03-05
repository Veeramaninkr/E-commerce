import {
    FETCH_ORDERS_REQUEST,
    FETCH_ORDERS_SUCCESS,
    FETCH_ORDERS_FAILURE,
    UPDATE_ORDER_REQUEST,
    UPDATE_ORDER_SUCCESS,
    UPDATE_ORDER_FAILURE,
    DELETE_ORDER_REQUEST,
    DELETE_ORDER_SUCCESS,
    DELETE_ORDER_FAILURE,
    CREATE_ORDER_REQUEST,
    CREATE_ORDER_SUCCESS,
    CREATE_ORDER_FAILURE,
    ADD_TO_CART,
    CLEAR_CART,
} from './actionType';

interface OrderState {
    orders: any[];
    items: any[];
    loading: boolean;
    error: string | null;
    meta: {
        current_page: number;
        total_pages: number;
        total_items: number;
        limit: number;
    } | null;
}

const initialState: OrderState = {
    orders: [],
    items: [],
    loading: false,
    error: null,
    meta: null,
};

const orderReducer = (state = initialState, action: any): OrderState => {
    switch (action.type) {
        case FETCH_ORDERS_REQUEST:
        case UPDATE_ORDER_REQUEST:
        case DELETE_ORDER_REQUEST:
        case CREATE_ORDER_REQUEST:
            return { ...state, loading: true, error: null };

        case FETCH_ORDERS_SUCCESS:
            return {
                ...state,
                loading: false,
                orders: action.payload.data,
                meta: action.payload.meta,
            };

        case UPDATE_ORDER_SUCCESS:
            const updatedOrderId = action.payload.id || action.payload._id;
            return {
                ...state,
                loading: false,
                orders: state.orders.map((order: any) =>
                    (order.id || order._id) === updatedOrderId ? action.payload : order
                ),
            };

        case DELETE_ORDER_SUCCESS:
            return {
                ...state,
                loading: false,
                orders: state.orders.filter((order: any) => (order.id || order._id) !== action.payload),
            };

        case CREATE_ORDER_SUCCESS:
            return {
                ...state,
                loading: false,
                orders: [...state.orders, action.payload],
                items: [], // Clear cart on successful order
            };

        case FETCH_ORDERS_FAILURE:
        case UPDATE_ORDER_FAILURE:
        case DELETE_ORDER_FAILURE:
        case CREATE_ORDER_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case ADD_TO_CART:
            const existingItemIndex = state.items.findIndex((item: any) => (item.id || item._id) === (action.payload.id || action.payload._id));
            if (existingItemIndex !== -1) {
                const newItems = [...state.items];
                newItems[existingItemIndex] = {
                    ...newItems[existingItemIndex],
                    quantity: (newItems[existingItemIndex].quantity || 1) + 1
                };
                return { ...state, items: newItems };
            }
            return {
                ...state,
                items: [...state.items, { ...action.payload, quantity: 1 }]
            };

        case CLEAR_CART:
            return { ...state, items: [] };

        default:
            return state;
    }
};

export default orderReducer;
