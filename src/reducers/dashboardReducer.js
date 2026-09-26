import { types } from "../types/types";
const initialState = {
  inscripciones:[]
}
export const dashboardReducer = (state=initialState,action) => {
  switch (action.type) {
  
    case types.dashboardLoadInscripciones:
      return {
        ...state,
        inscripciones:[...action.payload]
      }

    case types.dashboardUpdateInscripcion:
      return {
        ...state,
        inscripciones: state.inscripciones.map((sol) =>
        sol.id === action.payload.id
            ? { ...sol, estado: action.payload.estado }
            : sol
        ),
      };

    case types.dashboardDeleteInscripcion:
      return {
        ...state,
        inscripciones: state.inscripciones.filter((sol) => sol.id !== action.payload),
      };
    default:
      return state;
  }
}