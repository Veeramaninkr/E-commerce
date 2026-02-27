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
} from "./actionType";

interface AddProState {
  loading: boolean;
  error: string | null;
  product: any | null;
  addSuccess: boolean;
  removeSuccess: boolean;
  updateSuccess: boolean;
  getSuccess: boolean;
}

const initialState: AddProState = {
  loading: false,
  error: null,
  product: null,
  addSuccess: false,
  removeSuccess: false,
  updateSuccess: false,
  getSuccess: false,
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
        product: action.payload,
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
      return {
        ...state,
        loading: false,
        product: state.product.map((item: any) =>
          item._id === action.payload._id ? action.payload : item
        ),
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
    default:
      return state;
  }

};

export default addProReducer;
