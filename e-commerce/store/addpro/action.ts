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

export const addRequest = (payload?: any) => ({
  type: ADD_REQUEST,
  payload,
});

export const addSuccess = (payload: any) => ({
  type: ADD_SUCCESS,
  payload,
});

export const addFailure = (payload: any) => ({
  type: ADD_FAILURE,
  payload,
});

export const removeRequest = (payload?: any) => ({
  type: REMOVE_REQUEST,
  payload,
});

export const removeSuccess = (payload: any) => ({
  type: REMOVE_SUCCESS,
  payload,
});

export const removeFailure = (payload: any) => ({
  type: REMOVE_FAILURE,
  payload,
});

export const updateRequest = (payload?: any) => ({
  type: UPDATE_REQUEST,
  payload,
});

export const updateSuccess = (payload: any) => ({
  type: UPDATE_SUCCESS,
  payload,
});

export const updateFailure = (payload: any) => ({
  type: UPDATE_FAILURE,
  payload,
});

export const getRequest = (payload?: any) => ({
  type: GET_REQUEST,
  payload,
});
export const getSuccess = (payload: any) => ({
  type: GET_SUCCESS,
  payload,
});
export const getFailure = (payload: any) => ({
  type: GET_FAILURE,
  payload,
});

export const uploadImageRequest = (payload: any) => ({
  type: UPLOAD_IMAGE_REQUEST,
  payload,
});

export const uploadImageSuccess = (payload: any) => ({
  type: UPLOAD_IMAGE_SUCCESS,
  payload,
});

export const uploadImageFailure = (payload: any) => ({
  type: UPLOAD_IMAGE_FAILURE,
  payload,
});

export const downloadImageRequest = (payload: { imageUrl: string; fileName: string }) => ({
  type: DOWNLOAD_IMAGE_REQUEST,
  payload,
});

export const downloadImageSuccess = () => ({
  type: DOWNLOAD_IMAGE_SUCCESS,
});

export const downloadImageFailure = (payload: any) => ({
  type: DOWNLOAD_IMAGE_FAILURE,
  payload,
});


