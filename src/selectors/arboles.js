const plantados = (state) => state.arboles.arbolesPlantados;
const mapeados = (state) => state.arboles.arbolesMapeados;

/**
 * El mapa está cargando mientras cualquiera de las dos capas esté en vuelo:
 * son dos peticiones a Firestore, pero para quien mira son "los árboles".
 */
export const selectArbolesCargando = (state) =>
  plantados(state).loading || mapeados(state).loading;

/** El primer error que haya; alcanza para decidir si mostrar el reintento. */
export const selectArbolesError = (state) =>
  plantados(state).error ?? mapeados(state).error ?? null;

/** Si ya llegó algo, un error posterior es parcial, no total. */
export const selectHayArbolesCargados = (state) =>
  plantados(state).data.length > 0 || mapeados(state).data.length > 0;

/** Lo que de verdad hay para pintar, ya filtrado. */
export const selectTotalArbolesVisibles = (state) =>
  (plantados(state).isActive ? plantados(state).visibleData.length : 0) +
  (mapeados(state).isActive ? mapeados(state).visibleData.length : 0);
