
import { traerScoresGlobal } from "../helpers/traerScoresGlobal";
import { traerScoresMes } from "../helpers/traerScoresMes";
import { types } from "../types/types"

export const loadScoresMes = () => {
  return async(dispatch)=>{

    const scores = await traerScoresMes();


    dispatch(setScoresMes(scores))
  }
}
export const loadScoresGlobal = () => {
  return async(dispatch)=>{

    const scores = await traerScoresGlobal();


    dispatch(setScoresGlobal(scores))
  }
}
export const setScoresMes = (scoresMes) => {
  return {
    type: types.leaderboardLoadScoresMes,
    payload: scoresMes
  }
}
export const setScoresGlobal = (scoresGlobal) => {
  return {
    type: types.leaderboardLoadScoresGlobal,
    payload: scoresGlobal
  }
}