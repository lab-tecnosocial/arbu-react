import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunk from "redux-thunk";
import { catalogoReducer } from "../reducers/catalogoReducer";
import { leaderboardReducer } from "../reducers/leaderboardReducer";
import { mapaReducer } from "../reducers/mapaReducer";

const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
const reducers = combineReducers({
  mapa: mapaReducer,
  catalogo: catalogoReducer,
  leaderboard: leaderboardReducer
});
export const store = createStore(reducers
  ,
 composeEnhancers(applyMiddleware(thunk)));