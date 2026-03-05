import { call, put, takeLatest } from 'redux-saga/effects';
import api from '../api';
import {
    CREATE_COLLECTION_REQUEST,
    createCollectionSuccess,
    createCollectionFailure,
    FETCH_COLLECTIONS_REQUEST,
    fetchCollectionsSuccess,
    fetchCollectionsFailure,
    ADD_TO_WISHLIST_REQUEST,
    addToWishlistSuccess,
    addToWishlistFailure,
    FETCH_WISHLIST_REQUEST,
    fetchWishlistSuccess,
    fetchWishlistFailure,
    REMOVE_FROM_WISHLIST_REQUEST,
    removeFromWishlistSuccess,
    removeFromWishlistFailure,
} from './action';

function* createCollectionSaga(action: any): Generator<any, void, any> {
    try {
        const response = yield call(api.post, '/collections', { name: action.payload.name });
        yield put(createCollectionSuccess(response.data));
    } catch (error: any) {
        yield put(createCollectionFailure(error.message));
    }
}

function* fetchCollectionsSaga(): Generator<any, void, any> {
    try {
        const response = yield call(api.get, '/collections');
        yield put(fetchCollectionsSuccess(response.data));
    } catch (error: any) {
        yield put(fetchCollectionsFailure(error.message));
    }
}

function* addToWishlistSaga(action: any): Generator<any, void, any> {
    try {
        const response = yield call(api.post, '/wishlist', {
            product_id: action.payload.productId,
            collection_id: action.payload.collectionId,
        });
        yield put(addToWishlistSuccess(response.data));
    } catch (error: any) {
        yield put(addToWishlistFailure(error.message));
    }
}

function* fetchWishlistSaga(action: any): Generator<any, void, any> {
    try {
        const params = action.payload.collectionId ? { collection_id: action.payload.collectionId } : {};
        const response = yield call(api.get, '/wishlist', { params });
        yield put(fetchWishlistSuccess(response.data));
    } catch (error: any) {
        yield put(fetchWishlistFailure(error.message));
    }
}

function* removeFromWishlistSaga(action: any): Generator<any, void, any> {
    try {
        yield call(api.delete, `/wishlist/${action.payload.itemId}`);
        yield put(removeFromWishlistSuccess(action.payload.itemId));
    } catch (error: any) {
        yield put(removeFromWishlistFailure(error.message));
    }
}

export default function* wishlistSaga() {
    yield takeLatest(CREATE_COLLECTION_REQUEST, createCollectionSaga);
    yield takeLatest(FETCH_COLLECTIONS_REQUEST, fetchCollectionsSaga);
    yield takeLatest(ADD_TO_WISHLIST_REQUEST, addToWishlistSaga);
    yield takeLatest(FETCH_WISHLIST_REQUEST, fetchWishlistSaga);
    yield takeLatest(REMOVE_FROM_WISHLIST_REQUEST, removeFromWishlistSaga);
}
