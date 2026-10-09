import { ESTADO_CAMPANIA } from "../helpers/campanias/campaniaModel";

const slice = (state) => state.arboles.campanias;

export const selectCampaniasPublicas = (state) => slice(state).data;
export const selectCampaniasLoading = (state) => slice(state).loading;
export const selectCampaniaSeleccionadaId = (state) => slice(state).selectedId;

/** Derivadas, no duplicadas en el estado: un estado guardado se desincroniza. */
export const selectCampaniasActivas = (state) =>
  slice(state).data.filter((c) => c.estado === ESTADO_CAMPANIA.ACTIVA);

export const selectCampaniasPasadas = (state) =>
  slice(state).data.filter((c) => c.estado === ESTADO_CAMPANIA.CERRADA);

export const selectCampaniaSeleccionada = (state) => {
  const { data, selectedId } = slice(state);
  return data.find((c) => c.id === selectedId) ?? null;
};
