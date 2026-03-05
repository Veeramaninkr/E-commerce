export const CREATE_COLLECTION_REQUEST = 'CREATE_COLLECTION_REQUEST';
export const CREATE_COLLECTION_SUCCESS = 'CREATE_COLLECTION_SUCCESS';
export const CREATE_COLLECTION_FAILURE = 'CREATE_COLLECTION_FAILURE';

export const FETCH_COLLECTIONS_REQUEST = 'FETCH_COLLECTIONS_REQUEST';
export const FETCH_COLLECTIONS_SUCCESS = 'FETCH_COLLECTIONS_SUCCESS';
export const FETCH_COLLECTIONS_FAILURE = 'FETCH_COLLECTIONS_FAILURE';

export const ADD_TO_WISHLIST_REQUEST = 'ADD_TO_WISHLIST_REQUEST';
export const ADD_TO_WISHLIST_SUCCESS = 'ADD_TO_WISHLIST_SUCCESS';
export const ADD_TO_WISHLIST_FAILURE = 'ADD_TO_WISHLIST_FAILURE';

export const FETCH_WISHLIST_REQUEST = 'FETCH_WISHLIST_REQUEST';
export const FETCH_WISHLIST_SUCCESS = 'FETCH_WISHLIST_SUCCESS';
export const FETCH_WISHLIST_FAILURE = 'FETCH_WISHLIST_FAILURE';

export const REMOVE_FROM_WISHLIST_REQUEST = 'REMOVE_FROM_WISHLIST_REQUEST';
export const REMOVE_FROM_WISHLIST_SUCCESS = 'REMOVE_FROM_WISHLIST_SUCCESS';
export const REMOVE_FROM_WISHLIST_FAILURE = 'REMOVE_FROM_WISHLIST_FAILURE';

export const createCollectionRequest = (name: string) => ({
    type: CREATE_COLLECTION_REQUEST,
    payload: { name },
});

export const createCollectionSuccess = (collection: any) => ({
    type: CREATE_COLLECTION_SUCCESS,
    payload: collection,
});

export const createCollectionFailure = (error: string) => ({
    type: CREATE_COLLECTION_FAILURE,
    payload: error,
});

export const fetchCollectionsRequest = () => ({
    type: FETCH_COLLECTIONS_REQUEST,
});

export const fetchCollectionsSuccess = (collections: any[]) => ({
    type: FETCH_COLLECTIONS_SUCCESS,
    payload: collections,
});

export const fetchCollectionsFailure = (error: string) => ({
    type: FETCH_COLLECTIONS_FAILURE,
    payload: error,
});

export const addToWishlistRequest = (productId: string, collectionId?: string) => ({
    type: ADD_TO_WISHLIST_REQUEST,
    payload: { productId, collectionId },
});

export const addToWishlistSuccess = (item: any) => ({
    type: ADD_TO_WISHLIST_SUCCESS,
    payload: item,
});

export const addToWishlistFailure = (error: string) => ({
    type: ADD_TO_WISHLIST_FAILURE,
    payload: error,
});

export const fetchWishlistRequest = (collectionId?: string) => ({
    type: FETCH_WISHLIST_REQUEST,
    payload: { collectionId },
});

export const fetchWishlistSuccess = (items: any[]) => ({
    type: FETCH_WISHLIST_SUCCESS,
    payload: items,
});

export const fetchWishlistFailure = (error: string) => ({
    type: FETCH_WISHLIST_FAILURE,
    payload: error,
});

export const removeFromWishlistRequest = (itemId: string) => ({
    type: REMOVE_FROM_WISHLIST_REQUEST,
    payload: { itemId },
});

export const removeFromWishlistSuccess = (itemId: string) => ({
    type: REMOVE_FROM_WISHLIST_SUCCESS,
    payload: itemId,
});

export const removeFromWishlistFailure = (error: string) => ({
    type: REMOVE_FROM_WISHLIST_FAILURE,
    payload: error,
});
