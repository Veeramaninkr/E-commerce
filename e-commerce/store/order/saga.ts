import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import * as types from './actionType';
import * as actions from './action';
import api from '../api';

const fetchOrdersApi = (params: any) => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    console.log(params.search)
    if (params?.status && params.status !== 'all') queryParams.append('status', params.status);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const queryString = queryParams.toString();
    const url = queryString ? `/orders?${queryString}` : '/orders';
    return api.get(url);
};
const updateOrderApi = (orderId: string, data: any) => api.patch(`/orders/${orderId}`, data);
const deleteOrderApi = (orderId: string) => api.delete(`/orders/${orderId}`);
const createOrderApi = (data: any) => api.post('/orders', data);

function* fetchOrdersSaga(action: any): any {
    try {
        const response = yield call(fetchOrdersApi, action.payload);
        yield put(actions.fetchOrdersSuccess(response.data));
    } catch (error: any) {
        yield put(actions.fetchOrdersFailure(error.response?.data?.detail || error.message));
    }
}

function* updateOrderSaga(action: any): any {
    try {
        const { orderId, data } = action.payload;
        const response = yield call(updateOrderApi, orderId, data);
        yield put(actions.updateOrderSuccess(response.data));
    } catch (error: any) {
        yield put(actions.updateOrderFailure(error.response?.data?.detail || error.message));
    }
}

function* deleteOrderSaga(action: any): any {
    try {
        yield call(deleteOrderApi, action.payload);
        yield put(actions.deleteOrderSuccess(action.payload));
    } catch (error: any) {
        yield put(actions.deleteOrderFailure(error.response?.data?.detail || error.message));
    }
}

function* createOrderSaga(action: any): any {
    try {
        const response = yield call(createOrderApi, action.payload);
        yield put(actions.createOrderSuccess(response.data));
    } catch (error: any) {
        yield put(actions.createOrderFailure(error.response?.data?.detail || error.message));
    }
}

export function* orderSaga() {
    yield takeLatest(types.FETCH_ORDERS_REQUEST, fetchOrdersSaga);
    yield takeEvery(types.UPDATE_ORDER_REQUEST, updateOrderSaga);
    yield takeEvery(types.DELETE_ORDER_REQUEST, deleteOrderSaga);
    yield takeEvery(types.CREATE_ORDER_REQUEST, createOrderSaga);
}
