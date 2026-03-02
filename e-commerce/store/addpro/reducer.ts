import {
  ADD_REQUEST,
  ADD_SUCCESS,
  ADD_FAILURE,
  REMOVE_REQUEST,
  REMOVE_SUCCESS,
  REMOVE_FAILURE,
  UPDATE_REQUEST,
  UPDATE_SUCCESS,
  UPDATE_FAILURE,
  GET_REQUEST,
  GET_SUCCESS,
  GET_FAILURE,
  UPLOAD_IMAGE_REQUEST,
  UPLOAD_IMAGE_SUCCESS,
  UPLOAD_IMAGE_FAILURE,
  DOWNLOAD_IMAGE_REQUEST,
  DOWNLOAD_IMAGE_SUCCESS,
  DOWNLOAD_IMAGE_FAILURE,
} from "./actionType";

interface AddProState {
  loading: boolean;
  error: string | null;
  product: any | null;
  addSuccess: boolean;
  removeSuccess: boolean;
  updateSuccess: boolean;
  getSuccess: boolean;
  uploading: boolean;
  uploadedImageUrl: string | null;
  downloading: boolean;
}

const initialState: AddProState = {
  loading: false,
  error: null,
  product: null,
  addSuccess: false,
  removeSuccess: false,
  updateSuccess: false,
  getSuccess: false,
  uploading: false,
  uploadedImageUrl: null,
  downloading: false,
};

const addProReducer = (
  state: AddProState = initialState,
  action: any,
): AddProState => {
  switch (action.type) {
    case ADD_REQUEST:
    case REMOVE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        addSuccess: false,
        removeSuccess: false,
      };
    case ADD_SUCCESS:
      return {
        ...state,
        loading: false,
        product: Array.isArray(state.product)
          ? [...state.product, action.payload]
          : [action.payload],
        addSuccess: true,
        error: null,
      };
    case REMOVE_SUCCESS:
      return {
        ...state,
        loading: false,
        product: Array.isArray(state.product)
          ? state.product.filter((item: any) => (item.id || item._id) !== action.payload)
          : state.product,
        removeSuccess: true,
        error: null,
      };
    case ADD_FAILURE:
    case REMOVE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case UPDATE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        updateSuccess: false,
      };
    case UPDATE_SUCCESS:
      const updatedItem = action.payload;
      return {
        ...state,
        loading: false,
        product: Array.isArray(state.product)
          ? state.product.map((item: any) =>
            (item.id || item._id) === (updatedItem.id || updatedItem._id) ? updatedItem : item
          )
          : updatedItem,
        updateSuccess: true,
      };
    case UPDATE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case GET_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        getSuccess: false,
      };
    case GET_SUCCESS:
      return {
        ...state,
        loading: false,
        product: action.payload,
        getSuccess: true,
        error: null,
      };
    case GET_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case UPLOAD_IMAGE_REQUEST:
      return {
        ...state,
        uploading: true,
        uploadedImageUrl: null,
        error: null,
      };
    case UPLOAD_IMAGE_SUCCESS:
      console.log(action.payload.url);
      return {
        ...state,
        uploading: false,
        uploadedImageUrl: action.payload.url,
      };
    case UPLOAD_IMAGE_FAILURE:
      console.log(action.payload);
      return {
        ...state,
        uploading: false,
        error: action.payload,
      };
    case DOWNLOAD_IMAGE_REQUEST:
      return {
        ...state,
        downloading: true,
        error: null,

      };
    case DOWNLOAD_IMAGE_SUCCESS:
      return {
        ...state,
        downloading: false,
      };
    case DOWNLOAD_IMAGE_FAILURE:
      return {
        ...state,
        downloading: false,
        error: action.payload,
      };
    default:
      return state;
  }

};
export default addProReducer;
