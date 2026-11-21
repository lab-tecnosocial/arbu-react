import { loadViverosFirestore } from "../helpers/loadViverosFirestore";
import { types } from "../types/types";

export const fetchViverosRequest = () => ({
  type: types.VIVEROS_FETCH_REQUEST,
});

export const fetchViverosSuccess = (viveros) => ({
  type: types.VIVEROS_FETCH_SUCCESS,
  payload: viveros,
});

export const fetchViverosFailure = (error) => ({
  type: types.VIVEROS_FETCH_FAILURE,
  payload: error,
});

const yaEstaCargado = (slice, forzar) =>
  !forzar && !slice.error && (slice.loading || slice.data.length > 0);

export const startLoadingViveros = ({ forzar = false } = {}) => {
  return async (dispatch, getState) => {
    if (yaEstaCargado(getState().viveros, forzar)) return;

    try {
      dispatch(fetchViverosRequest());
      const viveros = await loadViverosFirestore({
        alRefrescar: (datos) => dispatch(fetchViverosSuccess(datos)),
      });
      dispatch(fetchViverosSuccess(viveros));
    } catch (error) {
      console.error("[viveros] no se pudieron cargar:", error);
      dispatch(fetchViverosFailure(error.message));
    }
  };
};
