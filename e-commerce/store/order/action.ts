import * as types from './actionType';

export const fetchOrdersRequest = () => ({
    type: types.FETCH_ORDERS_REQUEST,
});

export const fetchOrdersSuccess = (orders: any[]) => ({
    type: types.FETCH_ORDERS_SUCCESS,
    payload: orders,
});

export const fetchOrdersFailure = (error: string) => ({
    type: types.FETCH_ORDERS_FAILURE,
    payload: error,
});

export const updateOrderRequest = (orderId: string, data: any) => ({
    type: types.UPDATE_ORDER_REQUEST,
    payload: { orderId, data },
});

export const updateOrderSuccess = (order: any) => ({
    type: types.UPDATE_ORDER_SUCCESS,
    payload: order,
});

export const updateOrderFailure = (error: string) => ({
    type: types.UPDATE_ORDER_FAILURE,
    payload: error,
});

export const deleteOrderRequest = (orderId: string) => ({
    type: types.DELETE_ORDER_REQUEST,
    payload: orderId,
});

export const deleteOrderSuccess = (orderId: string) => ({
    type: types.DELETE_ORDER_SUCCESS,
    payload: orderId,
});

export const deleteOrderFailure = (error: string) => ({
    type: types.DELETE_ORDER_FAILURE,
    payload: error,
});

export const createOrderRequest = (data: any) => ({
    type: types.CREATE_ORDER_REQUEST,
    payload: data,
});

export const createOrderSuccess = (order: any) => ({
    type: types.CREATE_ORDER_SUCCESS,
    payload: order,
});

export const createOrderFailure = (error: string) => ({
    type: types.CREATE_ORDER_FAILURE,
    payload: error,
});

