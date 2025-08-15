import { loadInscripciones, actualizarSolicitud, eliminarSolicitud } from "../helpers/loadInscripciones"
import { types } from "../types/types"

export const startLoadingInscripciones = () => {
  return async (dispatch) => {
    const inscripciones = await loadInscripciones();
    dispatch(setInscripciones(inscripciones)); 
  }
}

export const setInscripciones = (inscripciones) => {
  return {
    type: types.dashboardLoadInscripciones,
    payload: inscripciones
  }
}

export const startUpdateSolicitudEstado = (id, nuevoEstado) => async (dispatch) => {
    try {
      await actualizarSolicitud(id, { estado: nuevoEstado }); 
      dispatch(updateInscripcion(id, nuevoEstado));
    } catch (error) {
      console.error('Error al actualizar solicitud:', error);
    }
};

export const updateInscripcion = (id, estado) => {
    return {
      type: types.dashboardUpdateInscripcion,
      payload: {id, estado}
    }
}

export const startDeleteSolicitud = (id) => async (dispatch) => {
    try {
      await eliminarSolicitud(id); 
      dispatch(deleteInscripcion(id));
    } catch (error) {
      console.error('Error al eliminar solicitud:', error);
    }
};

export const deleteInscripcion = (id) => {
    return {
      type: types.dashboardDeleteInscripcion,
      payload: id
    }
}