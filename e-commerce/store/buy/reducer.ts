import { SET_BUY_ITEMS, CLEAR_BUY_ITEMS } from "./actionType";
import { ADD_TO_CART, CLEAR_CART } from "../order/actionType";

export interface BuyState {
    items: any[];
}

const initialState: BuyState = {
    items: [],
};

const buyReducer = (state = initialState, action: any): BuyState => {
    switch (action.type) {
        case SET_BUY_ITEMS:
            return {
                ...state,
                items: action.payload,
            };
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
        case CLEAR_BUY_ITEMS:
        case CLEAR_CART:
            return {
                ...state,
                items: [],
            };
        default:
            return state;
    }
};

export default buyReducer;
