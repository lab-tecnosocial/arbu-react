import { types } from "../types/types";

const initialState = {
  scoresMes: [],
  scoresGlobal: [],
};
export const leaderboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.leaderboardLoadScoresMes:
      return {
        ...state,
        scoresMes: [...action.payload]
    }
    case types.leaderboardLoadScoresGlobal:
    return {
      ...state,
      scoresGlobal: [...action.payload]
    }
    default:
      return state;
  }
};
