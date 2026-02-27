import { call, put, takeEvery } from 'redux-saga/effects';
import * as types from './actionType';
import * as actions from './action';
import api from '../api';

const fetchOrdersApi = () => api.get('/orders');
const updateOrderApi = (orderId: string, data: any) => api.patch(`/orders/${orderId}`, data);
const deleteOrderApi = (orderId: string) => api.delete(`/orders/${orderId}`);
const createOrderApi = (data: any) => api.post('/orders', data);

function* fetchOrdersSaga(): any {
    try {
        const response = yield call(fetchOrdersApi);
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
    yield takeEvery(types.FETCH_ORDERS_REQUEST, fetchOrdersSaga);
    yield takeEvery(types.UPDATE_ORDER_REQUEST, updateOrderSaga);
    yield takeEvery(types.DELETE_ORDER_REQUEST, deleteOrderSaga);
    yield takeEvery(types.CREATE_ORDER_REQUEST, createOrderSaga);
}

