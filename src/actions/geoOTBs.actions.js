import { types } from "../types/types";

export const fetchGeoOTBsSuccess = (data) => ({
  type: types.FETCH_GEO_OTBS,
  payload: data,
})

export const fetchGeoScouts = () => {
  return async (dispatch) => {
    const response = await fetch('http://localhost:8080/triangulacion_grupos_scouts.geojson')
    const res = await response.json()
    dispatch(fetchGeoOTBsSuccess(res));
  }
}
