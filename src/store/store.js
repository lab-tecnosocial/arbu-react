import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunk from "redux-thunk";
import { catalogoReducer } from "../reducers/catalogoReducer";
import { leaderboardReducer } from "../reducers/leaderboardReducer";
import { mapaReducer } from "../reducers/mapaReducer";
import { arbolesPlantadosReducer } from "../reducers/arbolesPlantados.reducer";
import treeReducers from "../reducers/arboles.reducer";

const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
const reducers = combineReducers({
  mapa: mapaReducer,
  catalogo: catalogoReducer,
  leaderboard: leaderboardReducer,
  arbolesPlantados: arbolesPlantadosReducer,
  arboles: treeReducers,
});
export const store = createStore(reducers
  ,
  composeEnhancers(applyMiddleware(thunk)));
