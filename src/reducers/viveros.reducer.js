import { types } from "../types/types";

const initialState = {
  data: [],
  loading: false,
  error: null,
};

export const viverosReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.VIVEROS_FETCH_REQUEST:
      return { ...state, loading: true, error: null };

    case types.VIVEROS_FETCH_SUCCESS:
      return { ...state, data: action.payload, loading: false, error: null };

    case types.VIVEROS_FETCH_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
