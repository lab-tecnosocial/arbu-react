import { types } from "../types/types";

export const fetchGeoScoutsSuccess = (data) => ({
  type: types.FETCH_GEO_SCOUTS,
  payload: data,
})

export const setActiveGeoScouts = (value) => ({
  type: types.SHOW_GEO_SCOUTS,
  payload: value
})

export const fetchGeoScouts = () => {
  return async (dispatch) => {
    const response = await fetch('http://localhost:8080/triangulacion_grupos_scouts.geojson')
    const res = await response.json()
    dispatch(fetchGeoScoutsSuccess(res));
  }
}
