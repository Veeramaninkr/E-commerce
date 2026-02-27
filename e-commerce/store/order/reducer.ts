import * as types from './actionType';

interface OrderState {
    orders: any[];
    loading: boolean;
    error: string | null;
}

const initialState: OrderState = {
    orders: [],
    loading: false,
    error: null,
};

const orderReducer = (state = initialState, action: any): OrderState => {
    switch (action.type) {
        case types.FETCH_ORDERS_REQUEST:
        case types.UPDATE_ORDER_REQUEST:
        case types.DELETE_ORDER_REQUEST:
        case types.CREATE_ORDER_REQUEST:
            return { ...state, loading: true, error: null };

        case types.FETCH_ORDERS_SUCCESS:
            return { ...state, loading: false, orders: action.payload };

        case types.UPDATE_ORDER_SUCCESS:
            const updatedOrderId = action.payload.id || action.payload._id;
            return {
                ...state,
                loading: false,
                orders: state.orders.map((order: any) =>
                    (order.id || order._id) === updatedOrderId ? action.payload : order
                ),
            };

        case types.DELETE_ORDER_SUCCESS:
            return {
                ...state,
                loading: false,
                orders: state.orders.filter((order: any) => (order.id || order._id) !== action.payload),
            };

        case types.CREATE_ORDER_SUCCESS:
            return {
                ...state,
                loading: false,
                orders: [...state.orders, action.payload]
            };

        case types.FETCH_ORDERS_FAILURE:
        case types.UPDATE_ORDER_FAILURE:
        case types.DELETE_ORDER_FAILURE:
        case types.CREATE_ORDER_FAILURE:
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};

export default orderReducer;
