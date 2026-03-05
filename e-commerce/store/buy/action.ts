import { SET_BUY_ITEMS, CLEAR_BUY_ITEMS } from "./actionType";

export const setBuyItems = (items: any[]) => ({
    type: SET_BUY_ITEMS,
    payload: items,
});

export const clearBuyItems = () => ({
    type: CLEAR_BUY_ITEMS,
});
