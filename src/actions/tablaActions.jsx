import { actualizarNombreMapeado } from "../helpers/tabla"
import { types } from "../types/types"

export const startUpdateNombreMapeado = (id, nombreComun, nombreCientifico) => async (dispatch) => {
    try {
      await actualizarNombreMapeado(id, nombreComun, nombreCientifico); 
      dispatch(updateNombreMapeado(id, nombreComun, nombreCientifico));
    } catch (error) {
      console.error('Error al actualizar solicitud:', error);
    }
};

export const updateNombreMapeado = (id, nombreComun, nombreCientifico) => {
    return {
      type: types.tablaUpdateNombreMapeado,
      payload: {id, nombreComun, nombreCientifico}
    }
}