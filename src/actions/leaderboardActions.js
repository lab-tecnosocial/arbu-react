import { traerScores } from "../helpers/traerScores";
import { types } from "../types/types"

export const loadScoresMes = () => {
  return async(dispatch)=>{

    const scores = await traerScores();


    dispatch(setScoresMes(scores))
  }
}

export const setScoresMes = (scoresMes) => {
  return {
    type: types.leaderboardLoadScoresMes,
    payload: scoresMes
  }
}